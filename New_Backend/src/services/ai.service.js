import { GoogleGenerativeAI } from "@google/generative-ai";

// Establish connection with Google Gemini
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// Common Gemini configuration

const GEMINI_MODEL = "gemini-3.8-flash";

const MAX_RETRIES = 3;

const INITIAL_RETRY_DELAY = 1000;

// Helper: Sleep


const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

// Helper: Check whether Gemini error is retryable

const isRetryableError = (error) => {

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

// Helper: Generate Gemini content with retry

const generateWithRetry = async (prompt) => {

  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL
  });

  for (
    let attempt = 0;
    attempt <= MAX_RETRIES;
    attempt++
  ) {

    try {

      const result = await model.generateContent(prompt);

      return result.response.text();

    } catch (error) {

      console.error(
        `Gemini request failed (attempt ${attempt + 1}):`,
        error
      );

      const retryable = isRetryableError(error);

      const isLastAttempt =
        attempt === MAX_RETRIES;

      // Don't retry permanent errors or when all attempts are finished
      if (!retryable || isLastAttempt) {
        throw error;
      }

      const delay =
        INITIAL_RETRY_DELAY *
        Math.pow(2, attempt);

      console.warn(
        `Retrying Gemini request in ${delay}ms...`
      );

      await sleep(delay);
    }
  }
};

// GENERATE SUMMARY

export const generateSummary = async (text) => {

  if (!text || typeof text !== "string") {
    throw new Error(
      "Text is required for summary generation"
    );
  }

  const prompt = `
You are an expert academic reviewer.

Analyze the following research paper and generate a professional summary.

Rules:

- Do not use markdown.
- Do not use # symbols.
- Do not use ** symbols.
- Do not use * symbols.
- Use emojis in headings.
- Keep the response under 300 words.
- Use simple and professional language.

Format exactly like this:

📄 SHORT SUMMARY

Write a concise summary here.

🔑 KEY POINTS

1. Point one
2. Point two
3. Point three

🏷️ KEYWORDS

keyword1, keyword2, keyword3

Research Paper:

${text}
`;

  try {

    const summary = await generateWithRetry(prompt);

    console.log("Summary:", summary);

    return summary;

  } catch (error) {

    console.error(
      "Gemini Summary Error:",
      error
    );

    throw error;
  }
};

// GENERATE RAG ANSWER

export const generateRagAnswer = async (
  question,
  context
) => {

  if (!question || typeof question !== "string") {
    throw new Error(
      "Question is required for RAG answer"
    );
  }

  if (!context || typeof context !== "string") {
    throw new Error(
      "Context is required for RAG answer"
    );
  }

  const prompt = `
You are a research paper assistant.

Answer the user's question using only the provided context.

Rules:

- Use only the provided context.
- Do not use outside knowledge.
- Do not make up information.
- If the answer is not available in the context, say:
"I could not find the answer in this paper."
- Give a clear and concise answer.

Context:

${context}

Question:

${question}
`;

  try {

    const answer = await generateWithRetry(prompt);

    console.log("RAG Answer:", answer);

    return answer;

  } catch (error) {

    console.error(
      "Gemini RAG Error:",
      error
    );

    throw error;
  }
};