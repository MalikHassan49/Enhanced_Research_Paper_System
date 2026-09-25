import paperQueue from "./paper.queue.js";

const job = await paperQueue.add("chunking-paper", {
    paperId: '6a2ea4e7743b4bf697c22238'
});

console.log("Job added successfully", job.id);