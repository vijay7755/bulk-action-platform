const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
    type: { type: String, required: true },
    filters: { type: mongoose.Schema.Types.Mixed, default: {} }, // Store filter conditions
    updates: { type: mongoose.Schema.Types.Mixed },  // Store updates to apply
    records: [{ type: mongoose.Schema.Types.Mixed }]
});

const bulkActionSchema = new mongoose.Schema({
    entityType: { type: String, required: true },
    updates: [updateSchema],
    createdAt: { type: Date, default: Date.now },
    successCount: { type: Number, default: 0 },
    failureCount: { type: Number, default: 0 },
    status: {type: String, enum: ['queued', 'ongoing', 'completed'], default: "queued"},
});

const BulkAction = mongoose.model('BulkAction', bulkActionSchema);

module.exports = BulkAction;