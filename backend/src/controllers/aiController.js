const { analyzeRequest } = require('../services/ai/geminiService');

const analyze = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Request text is required' });
    }

    const analysis = await analyzeRequest(text);
    
    res.json(analysis);
  } catch (error) {
    console.error('Analyze controller error:', error);
    res.status(500).json({ error: 'AI analysis is temporarily unavailable.' });
  }
};

module.exports = { analyze };
