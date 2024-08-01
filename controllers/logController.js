const LogEntry = require('../models/Log');

exports.getLogs = async (req, res) => {
  try {
      const { level, entityType, bulkActionId, startDate, endDate } = req.query;
      const filter = {};

      if (level) filter.level = level;
      if (entityType) filter.entityType = entityType;
      if (bulkActionId) filter.bulkActionId = bulkActionId;
      if (startDate) filter.timestamp = { $gte: new Date(startDate) };
      if (endDate) filter.timestamp = { ...filter.timestamp, $lte: new Date(endDate) };

      const logs = await LogEntry.find(filter);
      res.json(logs);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};