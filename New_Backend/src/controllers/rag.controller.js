import { generatePaperAnswer } from "../services/rag.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const chatWithPaper = asyncHandler(async (req, res) => {
    console.log("RAG controller hit!");
    
    const { paperId } = req.params;
    const { question } = req.body;
    const normalizedPaperId = paperId?.trim();
    const normalizedQuestion = typeof question === "string" ? question.trim() : "";

    console.log("Paper ID:", normalizedPaperId);
    console.log("Question:", normalizedQuestion);

    if (!normalizedPaperId) {
        throw new ApiError(400, "Paper ID is required");
    }

    if (!normalizedQuestion) {
        throw new ApiError(400, "Question is required");
    }

    console.log("Validation passed");
    console.log("Calling generatePaperAnswer...");

    try {
        const searchResults = await generatePaperAnswer(
            normalizedQuestion,
            normalizedPaperId
        );

        console.log("generatePaperAnswer completed");
        console.log("RAG answer generated:", searchResults);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    searchResults,
                    "Relevant paper chunks retrieved successfully"
                )
            )
    } catch (error) {
        console.error("RAG chat generation failed:", error);
        throw new ApiError(
            503,
            "The AI assistant is currently unavailable. Please try again in a moment."
        );
    }
})