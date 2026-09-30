const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('ADMIN', 'MANAGER')); // Analytics are for management

router.get('/overview', async (req, res) => {
  try {
    const totalRequests = await db.query('SELECT COUNT(*) FROM requests');
    const pendingApprovals = await db.query("SELECT COUNT(*) FROM approvals WHERE status = 'PENDING'");
    
    const autoProcessed = await db.query("SELECT COUNT(*) FROM requests WHERE requires_human_review = false AND status = 'COMPLETED'");
    const totalCompleted = await db.query("SELECT COUNT(*) FROM requests WHERE status = 'COMPLETED' OR status = 'REJECTED'");

    let automationRate = 0;
    if (parseInt(totalCompleted.rows[0].count) > 0) {
      automationRate = Math.round((parseInt(autoProcessed.rows[0].count) / parseInt(totalCompleted.rows[0].count)) * 100);
    }

    // Requests by category
    const categoryDist = await db.query('SELECT category, COUNT(*) FROM requests WHERE category IS NOT NULL GROUP BY category');

    // Recent activity (last 5 audit logs)
    const recentActivity = await db.query(`
      SELECT a.*, r.title, u.name as actor_name
      FROM audit_logs a
      LEFT JOIN requests r ON a.request_id = r.id
      LEFT JOIN users u ON a.actor_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 5
    `);

    res.json({
      metrics: {
        totalRequests: parseInt(totalRequests.rows[0].count),
        pendingApprovals: parseInt(pendingApprovals.rows[0].count),
        automationRate,
        timeSaved: \`\${parseInt(autoProcessed.rows[0].count) * 15} mins\` // Rough estimate
      },
      categoryDistribution: categoryDist.rows,
      recentActivity: recentActivity.rows
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
