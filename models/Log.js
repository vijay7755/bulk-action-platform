const mongoose = require('mongoose');


const logEntrySchema = new mongoose.Schema({
  level: { type: String, enum: ['info', 'warn', 'error'], required: true },
  message: { type: String, required: true },
  entityType: { type: String },
  bulkActionId: { type: mongoose.Schema.Types.ObjectId },
  successCount: { type: Number },
  faliureCount: { type: Number },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed },
});

const LogEntry = mongoose.model('LogEntry', logEntrySchema);

module.exports = LogEntry;