import fs from "fs";
import { PDFParse } from "pdf-parse";

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    const pdfParser = new PDFParse({data: dataBuffer});
    const result = await pdfParser.getText();
    // console.log("Result: ", result);
    return result.text;
  } catch (error) {
    console.log("PDF extract error: ", error);
    throw error;
  }
}