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

YOUR TASK: Write a casual, conversational proposal that lands the job

Follow these rules:

1. Check for special instructions in the job post first - if there are any, follow them exactly
2. Tone: Like texting a knowledgeable colleague
   - 5-8 sentences total
   - Use contractions, be personable, skip corporate speak
   - No robotic or overly formal language
3. Structure:
   - Hook first: Open by showing how you can solve their specific problem (act as the expert they need)
   - Make it about them: Focus on their needs and the value you bring, not your credentials
   - Show you get it: Demonstrate you understand their exact requirements through natural conversation
   - End with action: Close with a simple question or clear CTA
4. Avoid:
   - Generic openings like "I read your posting" or "I'm interested" or "I can help" 
   - Em dashes (—)
   - Buzzwords and corporate jargon
   - Sounding like a cover letter

Remember: You're having a real conversation with someone who needs help. Be confident, direct, and genuinely helpful.
 5. Return ONLY JSON in this format:

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
