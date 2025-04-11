import path from "path";
import mammoth from "mammoth";
import fs from "fs/promises";
import PDFParser from "pdf2json";

export const isFileProcessable = (fileName) => {
  const allowedExtensions = [".pdf", ".docx"];
  return allowedExtensions.includes(path.extname(fileName).toLowerCase());
};

export const extractTextFromBuffer = async (buffer, filename) => {
  const ext = path.extname(filename).toLowerCase();

  try {
    if (ext === ".pdf") {
      return await extractPdfWithPdf2json(buffer);
    }

    if (ext === ".docx") {
      try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
      } catch (docxError) {
        console.error("DOCX parsing error:", docxError.message);
        return "[Error extracting text from DOCX]";
      }
    }

    throw new Error("Unsupported file type. Only PDF and DOCX are allowed.");
  } catch (error) {
    console.error("Error extracting text from buffer:", error.message);
    return "[Error processing document]";
  }
};

// PDF extraction using pdf2json
export const extractPdfWithPdf2json = async (buffer) => {
  const pdfParser = new PDFParser();
  
  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", errData => {
      console.error("PDF parsing error:", errData.parserError);
      reject(new Error("PDF parsing failed"));
    });
    
    pdfParser.on("pdfParser_dataReady", pdfData => {
      try {
        // Extract text from the parsed data
        let text = "";
        const pages = pdfData.Pages || [];
        
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const contents = page.Texts || [];
          
          for (let j = 0; j < contents.length; j++) {
            const content = contents[j];
            const strings = content.R || [];
            
            for (let k = 0; k < strings.length; k++) {
              const item = strings[k];
              text += decodeURIComponent(item.T) + " ";
            }
          }
          text += "\n\n"; // Add newlines between pages
        }
        
        resolve(text || "[No text content found in PDF]");
      } catch (error) {
        console.error("Error extracting PDF text:", error);
        reject(error);
      }
    });
    
    // Load the PDF data
    pdfParser.parseBuffer(buffer);
  });
};


export const processUploadedFile = async (buffer, filename) => {
  try {
    if (!buffer || buffer.length === 0) {
      throw new Error("Empty file buffer received");
    }
    
    return await extractTextFromBuffer(buffer, filename);
  } catch (error) {
    console.error(`Error processing uploaded file ${filename}:`, error.message);
    return `[Error processing file: ${error.message}]`;
  }
};