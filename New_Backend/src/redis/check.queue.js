import paperQueue from "./paper.queue.js";

const jobs = await paperQueue.getJobs([
    "waiting",
    "active",
    "completed",
    "failed"
]);

for (const job of jobs) {
    const state = await job.getState();

    console.log("Job Id: ", job.id);
    console.log("Job Name: ", job.name);
    console.log("Job data: ", job.data);
    console.log("Job state: ", state);
}

process.exit(0);