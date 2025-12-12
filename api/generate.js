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
3. Uses a CASUAL, friendly tone (like texting a colleague, not writing a formal letter)
   - Hooks the client immediately with relevance to their specific needs
   - Minimum of 5 sentences, 8 sentences max
   - Hooks the client immediately with sharing value first
   - Show value → Make it about the client, not the freelancer.
   - Shows you understand their exact requirements through natural conversation
   - Demonstrates confidence without being stuffy or overly formal
   - Gets straight to the solution in a relaxed way
   - Makes complete sense despite being brief
   - End with a simple question or CTA.
   - Do not sound like a robot please
 4. Avoid generic phrases like "I read your posting" or "I'm interested"
 5. Avoid using em dash  
 6. Write like you're having a real conversation - use contractions, be personable, skip the corporate speak
 7. Return ONLY JSON in this format:

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
