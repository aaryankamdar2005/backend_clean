import pdfParse from "pdf-parse";
import fs from "fs";
import path from "path";


export const isFileProcessable = (filePath) => {
    const allowedExtensions = [".pdf", ".docx"];
    return allowedExtensions.includes(path.extname(filePath).toLowerCase());
};


export const extractTextFromFile = async (filePath) => {
    try {
        if (!isFileProcessable(filePath)) {
            throw new Error("Unsupported file type. Only PDF and DOCX are allowed.");
        }

        const dataBuffer = fs.readFileSync(filePath);
        const text = await pdfParse(dataBuffer);
        return text.text;
    } catch (error) {
        console.error("Error extracting text:", error);
        throw new Error("Failed to extract text from file");
    }
};
