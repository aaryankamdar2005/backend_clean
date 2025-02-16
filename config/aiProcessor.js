import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const processResume = async (text1, jobDescription) => {
  const text = text1;

  const prompt = `
    Extract the following details from the resume:
    - Name
    - Contact Info
    - Skills
    - Experience
    - Education
    - Certifications
    - Summary

    Resume Content:\n${text}

    Match this resume with the job description below and provide:
    - A match score (0-100)
    - Constructive feedback

    Job Description:\n${jobDescription}
  `;

  try {
    console.log("Sending request to Groq...");
    console.log("Prompt length:", prompt.length);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "mixtral-8x7b-32768", 
        messages: [
          { role: "system", content: "You are an AI that evaluates resumes." },
          { role: "user", content: prompt }
        ],
        max_tokens: 500
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 15000 
      }
    );
console.log(response.data.choices[0].message.content);

    console.log("Response received:", response.data);
    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("Error processing resume with Groq:", error.response?.data || error.message);
    throw new Error("Failed to process resume with AI.");
  }
};
