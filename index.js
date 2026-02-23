import express from "express";
import cors from "cors";
import OpenAI from "openai";
import Groq from "groq-sdk";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Health check route
app.get("/", (req, res) => {
  res.send("Ravan AI backend running with OpenAI + Groq");
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const { message, provider } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    let reply;

    if (provider === "groq") {
      const completion = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are Ravan AI owned by Anand. Speak naturally like a human." },
          { role: "user", content: message }
        ]
      });

      reply = completion.choices[0].message.content;

    } else {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are Ravan AI owned by Anand. Speak naturally like a human." },
          { role: "user", content: message }
        ]
      });

      reply = completion.choices[0].message.content;
    }

    res.json({ reply });

  } catch (error) {
    console.error("Model error:", error);
    res.status(500).json({ error: "Model error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
