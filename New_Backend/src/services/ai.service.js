import { GoogleGenerativeAI } from "@google/generative-ai";

// establish connection with google server
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

export const generateSummary = async (text) => {
  try {
    // get gemini model from gooogle
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(`
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
`);

    const response = result.response;
    const summary = response.text();
    console.log("Summary: ", summary);
    return summary;
  } catch (error) {
    console.log("Gemini Error: ", error);
  }
}