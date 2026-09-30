const db = require('../config/db');

const getApprovals = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, r.title, r.description, r.category, r.priority, r.department_id, r.ai_analysis
      FROM approvals a
      JOIN requests r ON a.request_id = r.id
      WHERE a.status = 'PENDING'
      ORDER BY a.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get approvals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const resolveApproval = async (req, res, status) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const approvalCheck = await db.query('SELECT * FROM approvals WHERE id = $1', [id]);
    if (approvalCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Approval not found' });
    }

    const approval = approvalCheck.rows[0];
    if (approval.status !== 'PENDING') {
      return res.status(400).json({ error: 'Approval already resolved' });
    }

    // Update approval
    await db.query(
      'UPDATE approvals SET status = $1, approver_id = $2, resolved_at = CURRENT_TIMESTAMP WHERE id = $3',
      [status, req.user.id, id]
    );

    // Audit log
    await db.query(
      'INSERT INTO audit_logs (request_id, actor_id, event_type, description, metadata) VALUES ($1, $2, $3, $4, $5)',
      [approval.request_id, req.user.id, \`APPROVAL_\${status}\`, \`Request \${status.toLowerCase()} by manager\`, { reason }]
    );

    // Update request status
    const reqStatus = status === 'APPROVED' ? 'COMPLETED' : 'REJECTED';
    await db.query(
      'UPDATE requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [reqStatus, approval.request_id]
    );

    if (status === 'APPROVED') {
      await db.query(
        'INSERT INTO audit_logs (request_id, actor_id, event_type, description) VALUES ($1, $2, $3, $4)',
        [approval.request_id, req.user.id, 'WORKFLOW_COMPLETED', 'Workflow continued and completed after approval']
      );
    }

    res.json({ message: \`Request \${status.toLowerCase()} successfully\` });
  } catch (error) {
    console.error('Resolve approval error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const approve = (req, res) => resolveApproval(req, res, 'APPROVED');
const reject = (req, res) => resolveApproval(req, res, 'REJECTED');

module.exports = { getApprovals, approve, reject };
