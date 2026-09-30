const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { request_id } = req.query;
    
    let query = `
      SELECT a.*, u.name as actor_name
      FROM audit_logs a
      LEFT JOIN users u ON a.actor_id = u.id
    `;
    let params = [];

    if (request_id) {
      // Check if user is authorized to see this request's logs
      if (req.user.role === 'USER') {
        const reqCheck = await db.query('SELECT user_id FROM requests WHERE id = $1', [request_id]);
        if (reqCheck.rows.length === 0 || reqCheck.rows[0].user_id !== req.user.id) {
          return res.status(403).json({ error: 'Not authorized' });
        }
      }
      
      query += ' WHERE a.request_id = $1';
      params.push(request_id);
    } else if (req.user.role === 'USER') {
      // If no request_id and is USER, return only logs for their own requests
      query += ' JOIN requests r ON a.request_id = r.id WHERE r.user_id = $1';
      params.push(req.user.id);
    }

    query += ' ORDER BY a.created_at DESC LIMIT 100';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Audit logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
