export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: "API key is not configured" });
  }

  try {
    const { resume, jobDesc, systemPrompt } = request.body;

    if (!resume || !jobDesc || !systemPrompt) {
      return response.status(400).json({ error: "Missing required input" });
    }

    const result = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [{
            parts: [{
              text: `Resume:\n${resume}\n\nJob Description:\n${jobDesc}`
            }]
          }],
         generationConfig: {
  maxOutputTokens: 1024,
  thinkingConfig: {
    thinkingLevel: "low"
  }
}
        })
      }
    );

    const data = await result.json();
    return response.status(result.status).json(data);

  } catch (error) {
    return response.status(500).json({ error: "Analysis failed" });
  }
}
