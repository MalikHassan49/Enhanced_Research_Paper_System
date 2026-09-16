import dotenv from "dotenv";
import { createNodeRedisClient } from 'bullmq';
import { createClient } from 'redis';

dotenv.config();


const rawRedisClient = createClient({
    url: process.env.REDIS_URL
});

rawRedisClient.on("error", (error) => {
    console.log("Redis Url: ", error);
});

// await rawRedisClient.connect();

const bullmqconnection = createNodeRedisClient(rawRedisClient);

export { bullmqconnection }