import { generateRagAnswer } from "./ai.service.js";
import { generateEmbedding } from "./embeding.service.js";
import { searchPaperChunks } from "./qdrant.service.js";

export const generatePaperAnswer = async (
    question,
    paperId
) => {

    console.log("RAG service started");

    const questionEmbedding = await generateEmbedding(question);

    console.log("Question embedding generated");

    const searchResults = await searchPaperChunks(
        questionEmbedding,
        paperId,
        5
    );

    console.log("Qdrant search completed");
    console.log("Search results:", searchResults);

    const context = searchResults.map(
        (result) => result.payload?.text)
        .filter(Boolean)
        .join("\n\n");

    console.log("Context created");

    const answer = await generateRagAnswer(
        question,
        context
    );

    console.log("Gemini answer generated");

    return {
        answer,
        sources: searchResults
    };
}