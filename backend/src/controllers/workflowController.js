const { processWorkflow } = require('../services/workflow/workflowEngine');
const { analyzeRequest } = require('../services/ai/geminiService');
const db = require('../config/db');

const runWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reqQuery = await db.query('SELECT * FROM requests WHERE id = $1', [id]);
    if (reqQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const request = reqQuery.rows[0];

    // Log AI start
    await db.query(
      'INSERT INTO audit_logs (request_id, actor_id, event_type, description) VALUES ($1, $2, $3, $4)',
      [id, req.user.id, 'AI_ANALYSIS_STARTED', 'Starting Gemini AI analysis']
    );

    // Call Gemini
    const textToAnalyze = `Title: ${request.title}\nDescription: ${request.description}`;
    
    let aiAnalysis;
    try {
      aiAnalysis = await analyzeRequest(textToAnalyze);
    } catch (aiError) {
      // Fallback if AI fails
      await db.query(
        'INSERT INTO audit_logs (request_id, actor_id, event_type, description) VALUES ($1, $2, $3, $4)',
        [id, req.user.id, 'AI_ANALYSIS_FAILED', 'AI analysis is temporarily unavailable']
      );
      
      aiAnalysis = {
        category: 'GENERAL',
        priority: 'MEDIUM',
        department: 'Unknown',
        intent: 'Unknown',
        recommendedAction: 'HUMAN_REVIEW',
        requiresHumanReview: true,
        confidence: 0.0,
        reason: 'AI service unavailable. Routed to human for review.'
      };
    }

    // Process through workflow engine
    const result = await processWorkflow(id, req.user.id, aiAnalysis);

    res.json(result);
  } catch (error) {
    console.error('Run workflow error:', error);
    res.status(500).json({ error: 'Failed to run workflow' });
  }
};

module.exports = { runWorkflow };
