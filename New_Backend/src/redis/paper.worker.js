import { Worker } from "bullmq";
import dns from "node:dns";
import { bullmqconnection } from "../db/bullmq.js";
import { Paper } from "../models/paper.model.js";
import { ApiError } from "../utils/ApiError.js";
import { chunkText } from "../services/chunking.service.js";
import connectDB from "../db/db.js";
import { generateEmbeddings } from "../services/embeding.service.js";
import { createPaperCollection, upsertPaperChunks } from "../services/qdrant.service.js";

dns.setServers(["8.8.8.8"]);

await connectDB();

await createPaperCollection();

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

        const chunks = chunkText(paper?.extractedText);

        console.log("Total chunks: ", chunks.length);

        chunks.forEach((chunk, index) => {
            console.log(`Chunk: ${index + 1}`);
            console.log(chunk);
            console.log("---------------------");
        });

        const embeddings = await generateEmbeddings(chunks);

        console.log("Total embeddings: ", embeddings.length);
        console.log("Embeddings dimensions: ", embeddings[0]?.length);

        if (chunks.length !== embeddings.length) {
            throw new ApiError(
                500,
                "Chunks and embeddings count do not match"
            );
        }

        await upsertPaperChunks(
            chunks,
            embeddings,
            paper._id.toString()
        );

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