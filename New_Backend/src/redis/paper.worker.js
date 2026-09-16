import { Job, Worker } from "bullmq";
import { bullmqconnection } from "../db/bullmq.js";
import { Paper } from "../models/paper.model.js";
import { ApiError } from "../utils/ApiError.js";

const paperWorker = new Worker(
    "paper-processing",
    async (job) => {
        console.log("Job received: ", job.id);
        console.log("Job data: ", job.data);

        const paper = await Paper.findById(job.data.paperId);

        if (!paper) {
            throw new ApiError(404, "Paper not found");
        }

        console.log("Paper Found: ", paper.paperTitle);

        return {
            paperId: paper._id.toString(),
            status: "Paper found successfully"
        };
    },
    {
        connection: bullmqconnection
    }
);

paperWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed successfully`);
});

paperWorker.on("failed", (job, error) => {
    console.log(`Job ${job?.id} failed`, error);
});