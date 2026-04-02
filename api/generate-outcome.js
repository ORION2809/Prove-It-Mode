import { callNvidiaAPI } from './_nvidia.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { challenge, attempt } = req.body || {};

  if (!challenge || !attempt) {
    return res.status(400).json({ error: 'Missing required fields: challenge, attempt' });
  }

  if (!process.env.NVIDIA_API_KEY) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY not configured' });
  }

  try {
    const text = await callNvidiaAPI({
      userPrompt: `Given this challenge: "${challenge}"
And this attempt: "${attempt}"
Write one short phrase (under 10 words) describing what was actually built.
Examples: "localStorage book tracker with empty state" / "CSV parser using list comprehensions"
Only the phrase. No punctuation. No explanation.`,
      maxTokens: 60,
      temperature: 0.5,
    });

    const outcome = (text || '').trim().replace(/[."']/g, '');

    return res.status(200).json({ outcome });
  } catch (err) {
    console.error('Outcome generation error:', err.message);
    return res.status(500).json({ error: 'Failed to generate outcome' });
  }
}
