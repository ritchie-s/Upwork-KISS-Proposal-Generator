export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: 'OPENAI_API_KEY not configured in Vercel'
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: `
You are an expert Upwork proposal writer. Generate a KISS (Keep It Short and Simple) proposal for this job description:

${description}

CRITICAL INSTRUCTIONS:
1. Scan for any special instructions in the job post.
2. If found, YOU MUST follow them.
3. Create a 2–4 sentence casual, friendly proposal:
   - Short lines, max 4–6
   - No corporate tone
   - Directly relevant to the client
   - No generic filler
4. Return ONLY JSON in this format:

{
  "proposal": "text",
  "special_instructions_found": []
}
      `
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      console.error("OpenAI API error:", error);
      return res.status(500).json({
        error: error?.message || "OpenAI API request failed",
      });
    }

    const data = await response.json();
    const text = data.output[0].content[0].text;

    // Clean and parse JSON
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
}
