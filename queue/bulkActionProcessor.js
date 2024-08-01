const BulkAction = require("../models/BulkAction");
const mongoose = require("mongoose");
const models = {
  Contact: require("../models/Contact"),
  Company: require("../models/Company"),
};
const logger = require("../utils/logger");
const { logAction } = require("../controllers/logController");

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

    const model = getModel(bulkAction.entityType); // Get the model dynamically
    let totalSuccessCount = 0;
    let totalFailureCount = 0;
    // let totalSkippedCount = 0;

    // Process each update
    for (const update of bulkAction.updates) {
      const { type } = update;
      let successCount = 0;
      let failureCount = 0;
      //   let skippedCount = 0;
      console.log(
        `Updating of type: ${type}`
      );

      switch (type) {
        // case "email-domain-update":
        //   //   if (field === "email") {
        //   // Update only the domain part of the email
        //   const contacts = await model.find({});
        //   for (const contact of contacts) {
        //     try {
        //       const [localPart] = contact.email.split("@");
        //       const newEmail = `${localPart}@${value.split("@")[1]}`;
        //       contact.email = newEmail;
        //       await contact.save();
        //       successCount++;
        //     } catch (err) {
        //       console.error(
        //         `Error updating email for record ${contact._id}:`,
        //         err
        //       );
        //       failureCount++;
        //     }
        //   }
        //   //   }
        //   break;
        // case "update":
        //   console.log(
        //     "******************contacts-priority-update********************"
        //   );
        //   try {
        //     const totalDocuments = await model.countDocuments({});
        //     console.log("totalDoc: ", totalDocuments);
        //     // Batch processing
        //     for (let i = 0; i < totalDocuments; i += BATCH_SIZE) {
        //       console.log("*****************************************i: ", i);
        //       const result = await model.updateMany(
        //         {},
        //         { $set: { [update.field]: update.value } },
        //         { skip: i, limit: BATCH_SIZE }
        //       );
        //       successCount += result.modifiedCount;
        //       //   failureCount += (result.matchedCount || 0) - (result.modifiedCount || 0);
        //       //   skippedCount += result.matchedCount - result.modifiedCount;
        //     }

        //     logger.info({
        //         message: `Processed bulk action ${bulkActionId}`,
        //         entityType: bulkAction.entityType,
        //         updateType: type,
        //         field: update.field,
        //         value: update.value,
        //         successCount,
        //         failureCount,
        //         // skippedCount,
        //         timestamp: new Date(),
        //       });
        //   } catch (err) {
        //     console.error("Error updating priority:", err);
        //     failureCount++;
        //   }
        //   break;
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

            logger.info({
                message: `Processed bulk action ${bulkActionId}`,
                entityType: bulkAction.entityType,
                updateType: update.type,
                filters: JSON.stringify(update.filters),
                updates: JSON.stringify(update.updates),
                successCount,
                failureCount,
                timestamp: new Date(),
              });
          } catch (err) {
            console.error("Error applying conditional update:", err);
            failureCount++;
          }
          break;
        // Add more cases for additional action types
        default:
          throw new Error(`Unknown action type ${type}`);
      }

      totalSuccessCount += successCount;
      totalFailureCount += failureCount;
      //   totalSkippedCount += skippedCount;

      // Log details
    //   logger.info({
    //     message: `Processed bulk action ${bulkActionId}`,
    //     entityType: bulkAction.entityType,
    //     updateType: type,
    //     field,
    //     value,
    //     successCount,
    //     failureCount,
    //     // skippedCount,
    //     timestamp: new Date(),
    //   });
      logAction(
        "info",
        "Processed bulk action",
        bulkAction.entityType,
        bulkActionId,
        { changes: {
            filters: JSON.stringify(update.filters),
            updates: JSON.stringify(update.updates),
        } }
      );
    }

    bulkAction.successCount = totalSuccessCount;
    bulkAction.failureCount = totalFailureCount;
    // bulkAction.skippedCount = totalSkippedCount;

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
