import "dotenv/config";

import { GoogleGenAI } from '@google/genai';

console.log(
    "Gemini API key exists:",
    Boolean(process.env.GEMINI_API_KEY)
);

console.log(
    "Gemini API key length:",
    process.env.GEMINI_API_KEY?.length
);

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const EMBEDDING_MODEL = "gemini-embedding-001";

const EMBEDDING_BATCH_SIZE = 50;

const MAX_RETRIES = 4;

const INTITIAL_RETRY_DELAY = 1000;

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}

const isRetryableError = async (error) => {

    const status =
        error?.status ??
        error?.code ??
        error?.response?.status;

    return (
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504
    );
};


export const generateEmbeddingBatch = async (batch) => {

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {

        try {
            const response = await ai.models.embedContent({
                model: EMBEDDING_MODEL,
                contents: batch
            });

            return response.embeddings.map(
                (embedding) => embedding.values
            )
        } catch (error) {

            const retryable = isRetryableError(error);

            const isLastAttempt = attempt === MAX_RETRIES;

            if (!retryable || isLastAttempt) {
                throw error;
            }

            const delay = INTITIAL_RETRY_DELAY * Math.pow(2, attempt);

            console.warn(
                `Embedding request failed. ` +
                `Retrying in ${delay}ms` +
                `(attempt ${attempt + 1}/${MAX_RETRIES})`
            );
            await sleep(delay);
        }
    }
}

export const generateEmbeddings = async (chunks) => {

    if (!Array.isArray(chunks) || chunks.length === 0) {
        return [];
    }

    const allEmbeddings = [];

    for (
        let start = 0; start < chunks.length; start += EMBEDDING_BATCH_SIZE
    ) {

        const batch = chunks.slice(start, start + EMBEDDING_BATCH_SIZE);

        console.log(
            `Generating embeddings for ` +
            `chunks ${start + 1}-${start + batch.length}` +
            `of ${chunks.length}`
        );

        const batchEmbeddings = await generateEmbeddingBatch(batch);

        allEmbeddings.push(...batchEmbeddings);
    }
    return allEmbeddings;
}

export const generateEmbedding = async (text) => {

    if (!text || typeof text !== "string") {
        throw new Error("Text is required for embedding generation");
    }

    const embeddings = await generateEmbeddingBatch([text]);

    return embeddings[0];
}