const express = require('express');
const router = express.Router();
const bulkActionController = require('../controllers/bulkActionController');

// List all bulk actions
router.get('/', bulkActionController.listBulkActions);

// Create a new bulk action
router.post('/', bulkActionController.createBulkAction);

// Get the status of a specific bulk action
router.get('/:actionId', bulkActionController.getBulkActionStatus);

// Get statistics for a specific bulk action
router.get('/:actionId/stats', bulkActionController.getBulkActionStats);

module.exports = router;