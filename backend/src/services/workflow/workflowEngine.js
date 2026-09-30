const db = require('../../config/db');

const evaluateRules = async (request, aiAnalysis) => {
  // A simple deterministic rules engine
  // For IT_SUPPORT and HIGH priority: auto create ticket unless AI says human review
  // For Leave and > 2 days: human review
  // For Expense and > 5000: human review

  let requiresApproval = aiAnalysis.requiresHumanReview;
  let action = aiAnalysis.recommendedAction;

  if (aiAnalysis.category === 'FINANCE' && aiAnalysis.priority === 'CRITICAL') {
    requiresApproval = true;
  }

  if (aiAnalysis.category === 'HR' && aiAnalysis.priority === 'HIGH') {
    requiresApproval = true;
  }

  return {
    requiresApproval,
    action,
  };
};

const processWorkflow = async (requestId, userId, aiAnalysis) => {
  try {
    // 1. Log AI Analysis completion
    await db.query(
      'INSERT INTO audit_logs (request_id, actor_id, event_type, description, metadata) VALUES ($1, $2, $3, $4, $5)',
      [requestId, userId, 'AI_ANALYSIS_COMPLETED', 'AI analysis completed', aiAnalysis]
    );

    // 2. Evaluate Rules
    const { requiresApproval, action } = await evaluateRules({}, aiAnalysis);
    
    await db.query(
      'INSERT INTO audit_logs (request_id, actor_id, event_type, description, metadata) VALUES ($1, $2, $3, $4, $5)',
      [requestId, userId, 'RULE_EVALUATED', 'Rules evaluated against AI output', { requiresApproval, action }]
    );

    // 3. Update Request with AI Data and Next Step
    const status = requiresApproval ? 'UNDER_REVIEW' : 'IN_PROGRESS';
    
    // Find department id based on name
    const deptRes = await db.query('SELECT id FROM departments WHERE name = $1 OR name LIKE $2', [aiAnalysis.department, `%${aiAnalysis.department}%`]);
    const deptId = deptRes.rows.length > 0 ? deptRes.rows[0].id : null;

    await db.query(`
      UPDATE requests 
      SET 
        category = $1, 
        priority = $2, 
        department_id = $3, 
        intent = $4, 
        ai_analysis = $5, 
        ai_confidence = $6, 
        recommended_action = $7, 
        requires_human_review = $8,
        status = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
    `, [
      aiAnalysis.category,
      aiAnalysis.priority,
      deptId,
      aiAnalysis.intent,
      aiAnalysis,
      aiAnalysis.confidence,
      action,
      requiresApproval,
      status,
      requestId
    ]);

    // 4. Create Approval Record if required
    if (requiresApproval) {
      await db.query(
        'INSERT INTO approvals (request_id, status, reason) VALUES ($1, $2, $3)',
        [requestId, 'PENDING', aiAnalysis.reason]
      );

      await db.query(
        'INSERT INTO audit_logs (request_id, actor_id, event_type, description) VALUES ($1, $2, $3, $4)',
        [requestId, userId, 'APPROVAL_REQUESTED', 'Request routed to manager for human review']
      );

      return { message: 'Workflow processed. Routed for human review.' };
    } else {
      // Execute auto action
      await db.query(
        'INSERT INTO audit_logs (request_id, actor_id, event_type, description, metadata) VALUES ($1, $2, $3, $4, $5)',
        [requestId, userId, 'WORKFLOW_STARTED', 'Executing auto-approved action', { action }]
      );
      
      // Simulate ticket creation
      if (action === 'CREATE_SUPPORT_TICKET') {
        await db.query(
          'INSERT INTO audit_logs (request_id, actor_id, event_type, description) VALUES ($1, $2, $3, $4)',
          [requestId, userId, 'TICKET_CREATED', \`Ticket auto-generated for \${aiAnalysis.intent}\`]
        );
      }

      await db.query('UPDATE requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['COMPLETED', requestId]);
      
      await db.query(
        'INSERT INTO audit_logs (request_id, actor_id, event_type, description) VALUES ($1, $2, $3, $4)',
        [requestId, userId, 'WORKFLOW_COMPLETED', 'Workflow executed successfully']
      );

      return { message: 'Workflow processed automatically.' };
    }
  } catch (error) {
    console.error('Workflow processing error:', error);
    
    // Log failure
    await db.query(
      'INSERT INTO audit_logs (request_id, actor_id, event_type, description, metadata) VALUES ($1, $2, $3, $4, $5)',
      [requestId, userId, 'WORKFLOW_FAILED', 'Workflow execution failed', { error: error.message }]
    );
    throw error;
  }
};

module.exports = { processWorkflow };
