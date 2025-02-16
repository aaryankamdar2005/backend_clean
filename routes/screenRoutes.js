import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { extractTextFromFile,isFileProcessable } from "../config/extractText.js";
import { processResume } from "../config/aiProcessor.js";

const router = express.Router();


const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  console.log("Creating uploads directory...");
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


router.post("/upload", upload.single("resume"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      if (!isFileProcessable(req.file.originalname)) {
        return res.status(400).json({ 
          error: "Invalid file type. Only PDF and DOCX files are supported." 
        });
      }
  const file = req.file.path;

      console.log("Processing file:", req.file.path);
      const extractedText = await extractTextFromFile(req.file.path);
  

      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
      });
  
   

      const { jobDescription } = req.body;
      if (!jobDescription) {
          return res.status(400).json({ error: "Job description is required" });
      }
const process = await processResume(extractedText,jobDescription);

return res.json({ 
  success: true, 
  extractedText, 
  process
});

    } catch (error) {
      console.error("Error processing resume:", error);
      res.status(500).json({ 
        error: "Failed to process file", 
        details: error.message 
      });
    }
  });
  export default router;