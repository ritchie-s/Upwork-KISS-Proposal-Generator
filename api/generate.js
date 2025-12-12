export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  // Check if API key exists
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ 
      error: 'API key not configured. Please add ANTHROPIC_API_KEY to environment variables.' 
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are an expert Upwork proposal writer. Generate a KISS (Keep It Short and Simple) proposal for this job description.

Job Description:
${description}

CRITICAL INSTRUCTIONS:
1. First, scan for ANY special instructions in the job post (like "put number 88 in your application", "start with the word X", "include Y in your response", etc.)
2. If found, YOU MUST follow these instructions in your proposal
3. Create a compelling 2-4 sentence proposal that:
   - Uses a CASUAL, friendly tone (like texting a colleague, not writing a formal letter)
   - Hooks the client immediately with sharing value first
   - Shows you understand their exact requirements through natural conversation
   - Demonstrates confidence without being stuffy or overly formal
   - Gets straight to the solution in a relaxed way
   - Makes complete sense despite being brief
4. Avoid generic phrases like "I read your posting" or "I'm interested"
5. Write like you're having a real conversation - use contractions, be personable, skip the corporate speak

Return ONLY a JSON object with this exact structure (no markdown, no backticks):
{
  "proposal": "Your complete proposal text here",
  "special_instructions_found": ["instruction 1", "instruction 2"] or []
}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API error:', errorData);
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'API request failed' 
      });
    }

    const data = await response.json();
    const text = data.content[0].text;
    
    // Clean up the response and parse JSON
    const cleanText = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanText);
    
    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}
