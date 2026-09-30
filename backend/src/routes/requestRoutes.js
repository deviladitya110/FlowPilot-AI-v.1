const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { validate } = require('../validators/authValidator');
const { createRequestSchema, updateRequestStatusSchema } = require('../validators/requestValidator');
const { protect, authorize } = require('../middleware/authMiddleware');

// All request routes require authentication
router.use(protect);

router.get('/', requestController.getRequests);
router.get('/:id', requestController.getRequestById);
router.post('/', validate(createRequestSchema), requestController.createRequest);
router.patch('/:id', authorize('ADMIN', 'MANAGER'), validate(updateRequestStatusSchema), requestController.updateRequest);
router.delete('/:id', requestController.deleteRequest);

module.exports = router;
