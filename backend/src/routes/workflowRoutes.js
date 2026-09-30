const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/:id/run', workflowController.runWorkflow);

module.exports = router;
