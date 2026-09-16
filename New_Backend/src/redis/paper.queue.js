import { Queue } from "bullmq";
import { bullmqconnection } from "../db/bullmq.js";

const paperQueue = new Queue("paper-processing", {
    connection: bullmqconnection
});

export default paperQueue;