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
    The job description you provide should be short and crisp 

    Job Description:\n${jobDescription}
  `;

  try {
    console.log("Sending request to Groq...");
    console.log("Prompt length:", prompt.length);


    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192", 
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
    console.log("AI Raw Response:\n", response.data.choices[0].message);


    console.log("Response received:", response.data);
    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("Error processing resume with Groq:", error.response?.data || error.message);
    throw new Error("Failed to process resume with AI.");
  }
};
