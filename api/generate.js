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

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      error: 'GROQ_API_KEY not configured in Vercel'
    });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are an expert Upwork proposal writer. Generate a KISS (Keep It Short and Simple) proposal for this job description:
${description}

YOUR TASK: Write a casual, conversational proposal that lands the job.

Follow these rules:
1. Check for special instructions in the job post first - if there are any, follow them exactly
2. Tone: Like texting a knowledgeable colleague
   - 5-8 sentences total
   - Use contractions, be personable, skip corporate speak
   - No robotic or overly formal language
3. Structure:
   - Hook first: Open by showing how you can solve their specific problem
   - Make it about them: Focus on their needs and the value you bring
   - Show you get it: Demonstrate you understand their exact requirements
   - End with action: Close with a simple question or clear CTA
4. Avoid:
   - Generic openings like "I read your posting" or "I'm interested" or "I can help"
   - Em dashes
   - Buzzwords and corporate jargon
   - Sounding like a cover letter

Return ONLY a JSON object (no markdown, no backticks):
{
  "proposal": "Your complete proposal text here",
  "special_instructions_found": []
}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      return res.status(response.status).json({
        error: errorData.error?.message || 'Groq API request failed'
      });
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    // Clean and parse JSON
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({
      error: err.message || 'Internal server error'
    });
  }
}
