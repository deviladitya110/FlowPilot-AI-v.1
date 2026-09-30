const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'https://flow-pilot-ai-v-1-git-main-adii24.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const aiRoutes = require('./routes/aiRoutes');
const workflowRoutes = require('./routes/workflowRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const auditRoutes = require('./routes/auditRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FlowPilot AI API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
