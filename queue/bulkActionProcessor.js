const BulkAction = require("../models/BulkAction");
const mongoose = require("mongoose");
const models = {
  Contact: require("../models/Contact"),
  Company: require("../models/Company"),
};
const logger = require("../utils/logger");
const { logAction } = require("../utils/logAction");

// Function to get the correct model based on entityType
const getModel = (entityType) => {
  const model = models[entityType];
  if (!model) {
    throw new Error(`Model for entity type ${entityType} not found`);
  }
  return model;
};

const BATCH_SIZE = 500;

// Process a bulk action by ID
exports.processBulkAction = async (bulkActionId) => {
  try {
    // Fetch the bulk action details
    const bulkAction = await BulkAction.findById(bulkActionId);
    if (!bulkAction) throw new Error("Bulk action not found");

    bulkAction.status = "ongoing";
    await bulkAction.save();
    const model = getModel(bulkAction.entityType); // Get the model dynamically
    let totalSuccessCount = 0;
    let totalFailureCount = 0;

    // Process each update
    for (const update of bulkAction.updates) {
      const { type } = update;
      let successCount = 0;
      let failureCount = 0;
      console.log(`Update payload: `, type);

      switch (type) {
        case "conditional-update":
          try {
            const totalDocuments = await model.countDocuments(update.filters);
            for (let i = 0; i < totalDocuments; i += BATCH_SIZE) {
              const result = await model.updateMany(
                update.filters,
                { $set: update.updates },
                { skip: i, limit: BATCH_SIZE }
              );
              successCount += result.modifiedCount;
              //   failureCount += (result.matchedCount || 0) - (result.modifiedCount || 0);
            }
          } catch (err) {
            console.error("Error applying conditional update:", err);
            failureCount++;
          }
          break;

        case "insert-bulk":
          // Assuming update.records is an array of documents to insert
          for (let i = 0; i < update.records.length; i += BATCH_SIZE) {
            const batch = update.records.slice(i, i + BATCH_SIZE);
            try {
              const result = await model.insertMany(batch);
              successCount += result.length;
            } catch (err) {
              console.error("Error inserting bulk records:", err);
              failureCount += batch.length; // Assume all in batch failed on error
            }
          }
          break;

        case "delete-bulk":
          try {
            // This assumes that the deletion can be handled in a single operation or MongoDB handles it internally efficiently
            const result = await model.deleteMany(update.filters);
            successCount += result.deletedCount;
          } catch (err) {
            console.error("Error deleting records:", err);
            failureCount += BATCH_SIZE;
          }
          break;
        // Add more specific cases for additional action types
        default:
          throw new Error(`Unknown action type ${type}`);
      }

      logger.info({
        message: `Processed bulk action ${bulkActionId}`,
        entityType: bulkAction.entityType,
        updateType: type,
        filters: JSON.stringify(update.filters || {}),
        updates: JSON.stringify(update.updates || {}),
        successCount,
        failureCount,
        timestamp: new Date(),
      });

      logAction(
        "info",
        "Processed bulk action",
        bulkAction.entityType,
        bulkActionId,
        { changes: { filters: update.filters, updates: update.updates } },
        successCount,
        failureCount
      );

      totalSuccessCount += successCount;
      totalFailureCount += failureCount;
    }

    bulkAction.successCount = totalSuccessCount;
    bulkAction.failureCount = totalFailureCount;
    bulkAction.status = "completed";

    // Save the updated bulk action
    await bulkAction.save();
    console.log("Bulk action processed successfully.");
  } catch (err) {
    logger.error({
      message: `Error processing bulk action ${bulkActionId}`,
      error: err.message,
      timestamp: new Date(),
    });
    logAction("error", "Error processing bulk action", null, bulkActionId, {});
    throw err;
  }
};
