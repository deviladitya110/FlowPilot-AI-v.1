const db = require('../config/db');

const getRequests = async (req, res) => {
  try {
    let query = `
      SELECT r.*, d.name as department_name, u.name as user_name 
      FROM requests r
      LEFT JOIN departments d ON r.department_id = d.id
      LEFT JOIN users u ON r.user_id = u.id
    `;
    let params = [];

    // If regular user, only show their requests
    if (req.user.role === 'USER') {
      query += ' WHERE r.user_id = $1';
      params.push(req.user.id);
    }
    
    query += ' ORDER BY r.created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(`
      SELECT r.*, d.name as department_name, u.name as user_name 
      FROM requests r
      LEFT JOIN departments d ON r.department_id = d.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const request = result.rows[0];

    // Check permissions
    if (req.user.role === 'USER' && request.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(request);
  } catch (error) {
    console.error('Get request by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createRequest = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const result = await db.query(
      'INSERT INTO requests (user_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, title, description, 'PENDING']
    );

    const request = result.rows[0];

    // Log the event
    await db.query(
      'INSERT INTO audit_logs (request_id, actor_id, event_type, description) VALUES ($1, $2, $3, $4)',
      [request.id, req.user.id, 'REQUEST_CREATED', 'Request created by user']
    );

    res.status(201).json(request);
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await db.query(
      'UPDATE requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check ownership or admin status
    const reqCheck = await db.query('SELECT user_id FROM requests WHERE id = $1', [id]);
    if (reqCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (req.user.role === 'USER' && reqCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await db.query('DELETE FROM requests WHERE id = $1', [id]);
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest
};
