const LogEntry = require('./../models/Log');


async function logAction(level, message, entityType = null, bulkActionId = null, metadata = {}, successCount, failureCount) {
  try {
    const logEntry = new LogEntry({
      level,
      message,
      entityType,
      bulkActionId,
      metadata,
      successCount,
      failureCount
    });

    await logEntry.save();
    // console.log('Log entry saved:', message);
  } catch (error) {
    console.error('Error saving log entry:', error);
  }
}

module.exports = {
    logAction
}

// Usage example
// logAction('info', 'Processed bulk action', 'Contact', someContactId, { changes: { email: 'new@example.com' } });
