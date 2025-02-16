import { ChatGroq } from "@langchain/groq";
import "dotenv/config";

const groq = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY, 
  });

const generator = async (req, res) => {
    const { section, inputText } = req.body;
  
    try {
      const response = await groq.invoke([
        { role: "system", content: "You are an AI resume assistant." },
        { role: "user", content: `Generate a resume section for ${section}:
  ${inputText}` },
      ]);

      res.json({ generatedText: response.content });
    } catch (error) {
      console.error("Groq API Error:", error);
      res.status(500).json({ error: "Failed to generate text" });
    }
  };

  export default generator;