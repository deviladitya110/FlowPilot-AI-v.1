const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('ADMIN', 'MANAGER')); // Only managers and admins can do approvals

router.get('/', approvalController.getApprovals);
router.post('/:id/approve', approvalController.approve);
router.post('/:id/reject', approvalController.reject);

module.exports = router;
