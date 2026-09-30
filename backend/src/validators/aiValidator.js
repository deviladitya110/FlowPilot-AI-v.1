const { z } = require('zod');

const aiAnalysisSchema = z.object({
  category: z.enum(['IT_SUPPORT', 'HR', 'FINANCE', 'ACADEMIC', 'ADMINISTRATION', 'GENERAL']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  department: z.string(),
  intent: z.string(),
  recommendedAction: z.enum(['AUTO_APPROVE', 'AUTO_ROUTE', 'CREATE_SUPPORT_TICKET', 'REQUEST_INFORMATION', 'HUMAN_REVIEW']),
  requiresHumanReview: z.boolean(),
  confidence: z.number().min(0).max(1),
  reason: z.string(),
});

module.exports = {
  aiAnalysisSchema
};
