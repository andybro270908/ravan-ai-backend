import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();

app.use(cors());
app.use(express.json());

/* ==============================
   Groq Initialization
============================== */

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/* ==============================
   Health Check
============================== */

app.get("/", (req, res) => {
  res.send("Ravan AI Groq Backend Running");
});

/* ==============================
   Chat Route
============================== */

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",   // current stable model
      messages: [
        {
          role: "system",
          content: "You are Ravan AI, owned by Anand. Speak naturally like a human."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({
      error: error.message || "Server error"
    });
  }
});

/* ==============================
   Start Server
============================== */

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
