const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const User = require("../models/userModel");

const router = express.Router();
const requestWindows = new Map();
const REQUEST_LIMIT = 15;
const WINDOW_MS = 10 * 60 * 1000;

const roleGuidance = {
  student: "Students can browse courses, purchase and enroll in courses, access My Learning, complete lessons and quizzes, request meetings after purchasing a course, and edit their profile.",
  instructor: "Instructors can create and manage courses, upload lessons, create quizzes, manage meeting requests, review their instructor dashboard, and edit their profile. Instructors cannot purchase or enroll in courses.",
  admin: "Administrators can use the administration dashboard, review instructors, students, and instructor course reports. Administrators cannot purchase or enroll in courses.",
};

const isWithinRateLimit = (userId) => {
  const now = Date.now();
  const current = requestWindows.get(userId) || [];
  const recent = current.filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recent.length >= REQUEST_LIMIT) {
    requestWindows.set(userId, recent);
    return false;
  }
  recent.push(now);
  requestWindows.set(userId, recent);
  return true;
};

const extractText = (response) => {
  return (response.candidates?.[0]?.content?.parts || [])
    .map((part) => part.text || "")
    .join("\n")
    .trim();
};

router.post("/chat", isAuthenticated, async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ message: "The AI assistant is not configured yet." });
    }

    if (!isWithinRateLimit(String(req.id))) {
      return res.status(429).json({ message: "You have sent too many messages. Please wait a few minutes and try again." });
    }

    const user = await User.findById(req.id).select("name role");
    if (!user) return res.status(401).json({ message: "User not authenticated." });

    const messages = Array.isArray(req.body.messages) ? req.body.messages.slice(-8) : [];
    const safeMessages = messages
      .filter((message) => ["user", "assistant"].includes(message?.role) && typeof message?.content === "string")
      .map((message) => ({ role: message.role, content: message.content.trim().slice(0, 1000) }))
      .filter((message) => message.content);
    if (!safeMessages.length || !safeMessages.some((message) => message.role === "user")) {
      return res.status(400).json({ message: "Please enter a question for the assistant." });
    }

    const instructions = `You are the Codetech LMS Assistant. Give short, clear, friendly answers about this website only. The current user's name is ${user.name} and role is ${user.role}. ${roleGuidance[user.role] || "Explain the public Codetech learning platform."} Do not invent features, prices, policies, course progress, personal data, or actions you cannot verify. Do not claim you can perform changes. If a question is unrelated to Codetech, politely say that you specialize in helping with the Codetech LMS.`;
    const model = process.env.GEMINI_CHAT_MODEL || "gemini-3.5-flash";
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instructions }] },
        contents: safeMessages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        generationConfig: {
          maxOutputTokens: 350,
          temperature: 0.4,
        },
      }),
    });

    const responseBody = await geminiResponse.json();
    if (!geminiResponse.ok) {
      console.error("Gemini assistant request failed:", responseBody?.error?.message || geminiResponse.status);
      return res.status(502).json({ message: "The AI assistant is temporarily unavailable. Please try again." });
    }

    const reply = extractText(responseBody);
    if (!reply) return res.status(502).json({ message: "The AI assistant returned an empty response. Please try again." });
    return res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error("Gemini assistant request failed:", error.message);
    return res.status(500).json({ message: "Unable to reach the AI assistant right now." });
  }
});

module.exports = router;
