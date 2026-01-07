import { OPENROUTER_API_KEY } from "./config.js";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const { messages, max_tokens, temperature } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://your-vercel-domain.vercel.app",
          "X-Title": "Trinetra AI"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages,
          max_tokens: max_tokens || 1000,
          temperature: temperature || 0.7
        })
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: err.message || "OpenRouter request failed"
    });
  }
}
