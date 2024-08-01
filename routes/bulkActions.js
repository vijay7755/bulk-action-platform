const express = require('express');
const router = express.Router();
const bulkActionController = require('../controllers/bulkActionController');
const logController = require('../controllers/logController');

// List all bulk actions
router.get('/', bulkActionController.listBulkActions);

// Create a new bulk action
router.post('/', bulkActionController.createBulkAction);

// display the status of ongoing, completed, and queued actions
router.get('/status', bulkActionController.getActionStatus);

// provide the ability to fetch and filter logs
router.get('/logs', logController.getLogs);

// Get the status of a specific bulk action
router.get('/:actionId', bulkActionController.getBulkActionStatus);

// Get statistics for a specific bulk action
router.get('/:actionId/stats', bulkActionController.getBulkActionStats);


// show the real-time progress of current bulk actions
router.get('/progress/:actionId', bulkActionController.getProgress);


module.exports = router;