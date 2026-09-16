import paperQueue from "./paper.queue.js";

const job = await paperQueue.add("test-paper", {
    paperId: "12345",
    message: "Hello BullMQ"
});

console.log("Job added successfully", job.id);