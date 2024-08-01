const BulkAction = require('../models/BulkAction');
const queueManager = require('../queue/queueManager');

// List all bulk actions
exports.listBulkActions = async (req, res) => {
    try {
        const actions = await BulkAction.find();
        res.json(actions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new bulk action
exports.createBulkAction = async (req, res) => {
    try {
        const { entityType, updates } = req.body;

        // Validate the request
        if (!entityType || !updates || !Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        // Create a new bulk action
        const bulkAction = new BulkAction({ entityType, updates });
        await bulkAction.save();

        // Add the job to the queue
        queueManager.add({ bulkActionId: bulkAction._id });

        res.status(201).json({message: "BulkAction executed successfully", actionId:  bulkAction._id});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get the status of a specific bulk action
exports.getBulkActionStatus = async (req, res) => {
    try {
        const actionId = req.params.actionId;
        const bulkAction = await BulkAction.findById(actionId);

        if (!bulkAction) {
            return res.status(404).json({ message: 'Bulk action not found' });
        }

        res.json(bulkAction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get statistics for a specific bulk action
exports.getBulkActionStats = async (req, res) => {
    try {
        const actionId = req.params.actionId;
        const bulkAction = await BulkAction.findById(actionId);

        if (!bulkAction) {
            return res.status(404).json({ message: 'Bulk action not found' });
        }

        // Aggregate statistics
        const stats = {
            entityType: bulkAction.entityType,
            createdAt: bulkAction.createdAt,
            total: bulkAction.updates.length,
            success: bulkAction.successCount || 0,
            failure: bulkAction.failureCount || 0,
            skippedCount: bulkAction.skippedCount || 0,
        };

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};