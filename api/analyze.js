export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST request" });
  }

  try {
    const apiKey = process.env.VITE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Missing API key",
      });
    }

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "No text provided",
      });
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `Analyze this audio transcript:\n${text}` }],
            },
          ],
        }),
      }
    );

    const data = await geminiResponse.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      error: "Analysis failed",
      details: err.message,
    });
  }
}
