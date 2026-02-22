import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Groq client
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content:
            "You are Ravan AI, a smart human-like assistant owned by Anand. Speak naturally like a real intelligent human.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({
      error: "Model error",
      details: error.response?.data || error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Ravan AI backend running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
