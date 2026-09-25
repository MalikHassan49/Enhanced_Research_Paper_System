import { v5 as uuidv5 } from "uuid";
import { QdrantClient } from '@qdrant/js-client-rest';

const RAG_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

const qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY
});

const COLLECTION_NAME = "research_papers";

export const createPaperCollection = async () => {

    const collections = await qdrantClient.getCollections();

    const collectionExist = collections.collections.some(
        (collection) => collection.name === COLLECTION_NAME
    );

    if (collectionExist) {
        console.log(`Collection ${COLLECTION_NAME} already exists.`);
        return;
    }

    await qdrantClient.createCollection(
        COLLECTION_NAME,
        {
            vectors: {
                size: 3072,
                distance: 'Cosine'
            }
        }
    );
    console.log(`Collection ${COLLECTION_NAME} created successfully`);
}

export const upsertPaperChunks = async (
    chunks,
    embeddings,
    paperId
) => {
    const points = chunks.map((chunk, index) => ({
        id: uuidv5(`${paperId}-${index}`,
            RAG_NAMESPACE
        ),

        vector: embeddings[index],

        payload: {
            text: chunk,
            paperId: paperId,
            chunkIndex: index
        }
    }));

    await qdrantClient.upsert(
        COLLECTION_NAME,
        {
            wait: true,
            points
        }
    );

    console.log(
        `${points.length} points inserted into Qdrant`
    );
}

export const searchPaperChunks = async (
    questionEmbedding,
    paperId,
    limit = 5
) => {

    console.log("Qdrant search started");

    console.log("Paper ID for Qdrant:", paperId);

    console.log(
        "Question embedding dimensions:",
        questionEmbedding.length
    );

    // const results = await qdrantClient.query(
    //     COLLECTION_NAME,
    //     {
    //         query: questionEmbedding,
    //         limit,
    //         with_payload: true,
    //         filter: {
    //             must: [
    //                 {
    //                     key: "paperId",
    //                     match: {
    //                         value: paperId
    //                     }
    //                 }
    //             ]
    //         }
    //     }
    // );

    const results = await qdrantClient.query(
        COLLECTION_NAME,
        {
            query: questionEmbedding,
            limit,
            with_payload: true
        }
    );

    console.log("Qdrant query finished");

    console.log("Qdrant results:", results);

    return results.points;
}

export default qdrantClient;