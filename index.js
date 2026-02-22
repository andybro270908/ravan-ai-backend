import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content:
                "You are Ravan, a highly intelligent human-like AI assistant created by Anand. Speak naturally and professionally."
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (data.choices) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "Model error", details: data });
    }

  } catch (error) {
    res.status(500).json({ error: "Server error", details: error });
  }
});

app.listen(PORT, () => {
  console.log("Ravan AI server running on port", PORT);
});
