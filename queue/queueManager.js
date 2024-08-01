const Queue = require("bull");
const bulkActionProcessor = require("./bulkActionProcessor");

// Create a new queue
const bulkActionQueue = new Queue("bulk-action-queue", {
  redis: { host: "127.0.0.1", port: 6379 },
});

// Process jobs in the queue
bulkActionQueue.process(async (job, done) => {
  try {
    console.log("bulkActionQueue job: ", job.id, job.data);
    await bulkActionProcessor.processBulkAction(job.data.bulkActionId);
    done();
  } catch (err) {
    console.error(`Failed to process job ${job.id}:`, err);
    done(err);
  }
});

module.exports = {
  add: (data) => {
    console.log("Adding bulk action to queue with data: ", data);
    bulkActionQueue.add(data)
      .then((job) => {
        console.log(`Added job ${job.id} to the queue`);
      })
      .catch((err) => {
        console.error("Failed to add job to queue:", err);
      });
  },
};
