import express from "express";
import multer from "multer";
import path from "path";
import { extractTextFromBuffer, isFileProcessable } from "../config/extractText.js";
import { processResume } from "../config/aiProcessor.js";

const router = express.Router();

// In-memory file storage
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const originalName = req.file.originalname;
    if (!isFileProcessable(originalName)) {
      return res.status(400).json({
        error: "Invalid file type. Only PDF and DOCX files are supported."
      });
    }

    const extractedText = await extractTextFromBuffer(req.file.buffer, originalName);

    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ error: "Job description is required" });
    }

    const process = await processResume(extractedText, jobDescription);

    return res.json({
      success: true,
      extractedText,
      process
    });

  } catch (error) {
    console.error("Error processing resume:", error.message);
    res.status(500).json({
      error: "Failed to process file",
      details: error.message
    });
  }
});

export default router;
