import { callNvidiaAPI } from './_nvidia.js';

const SYSTEM_PROMPT = `You are a diagnostic tool for mental models. You do not teach. You do not encourage. You reflect what you see with uncomfortable precision.

You MUST respond in EXACTLY this format — no extra text, under 120 words total:
SOLID: [1-2 things their mental model gets right — cite their actual words as evidence]
BROKEN: [The single most important gap, named precisely — not a list, ONE thing]
ONE_FIX: [The exact concept to understand before building anything — one sentence, an action not a lesson]`;

function buildUserPrompt({ topic, traps, confessions }) {
  return `TOPIC: "${topic}"

THE THREE TRAPS (what was actually wrong with each):
Trap 1 was wrong because: ${traps.wrongBecause[0]}
Trap 2 was wrong because: ${traps.wrongBecause[1]}
Trap 3 was wrong because: ${traps.wrongBecause[2]}

WHAT THE LEARNER SAID:
About Trap 1: "${confessions[0] || '(left blank)'}"
About Trap 2: "${confessions[1] || '(left blank)'}"
About Trap 3: "${confessions[2] || '(left blank)'}"

Analyze their explanations. Rules:
- A vague explanation reveals a vague mental model
- A confident wrong explanation reveals a specific misconception
- Silence or "I don't know" reveals a gap they haven't even found yet
- If they nailed it, say so — but only if the evidence is in their own words

Respond in EXACTLY this format:
SOLID: [1–2 things their mental model has right — cite their actual words as evidence. If nothing is solid, say so plainly.]
BROKEN: [The single most important gap, named precisely — not a list, ONE thing. Be specific enough that they feel it.]
ONE_FIX: [The exact concept they need to understand before building anything with ${topic} — one sentence, an action not a lesson]

Tone: Like a diagnostic report. Not encouraging, not harsh. Precise. Almost clinical.
Under 120 words total. No code samples. No suggestions to re-watch anything. No platitudes.`;
}

function parseResponse(text) {
  const result = { solid: '', broken: '', oneFix: '' };

  const lines = text.trim().split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('SOLID:')) {
      result.solid = trimmed.replace('SOLID:', '').trim();
    } else if (trimmed.startsWith('BROKEN:')) {
      result.broken = trimmed.replace('BROKEN:', '').trim();
    } else if (trimmed.startsWith('ONE_FIX:') || trimmed.startsWith('ONE FIX:')) {
      result.oneFix = trimmed.replace(/ONE[_ ]FIX:/, '').trim();
    }
  }

  // Fallback: if parsing missed fields, try broader matching
  if (!result.solid || !result.broken || !result.oneFix) {
    const fullText = text.trim();
    const solidMatch = fullText.match(/SOLID:\s*(.+?)(?=BROKEN:|$)/s);
    const brokenMatch = fullText.match(/BROKEN:\s*(.+?)(?=ONE[_ ]FIX:|$)/s);
    const fixMatch = fullText.match(/ONE[_ ]FIX:\s*(.+?)$/s);

    if (solidMatch) result.solid = solidMatch[1].trim();
    if (brokenMatch) result.broken = brokenMatch[1].trim();
    if (fixMatch) result.oneFix = fixMatch[1].trim();
  }

  return result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, traps, confessions } = req.body || {};

  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'Topic is required' });
  }

  if (!traps || !Array.isArray(traps.wrongBecause) || traps.wrongBecause.length < 3) {
    return res.status(400).json({ error: 'Traps data is required' });
  }

  if (!confessions || !Array.isArray(confessions) || confessions.length < 3) {
    return res.status(400).json({ error: 'Three confessions are required' });
  }

  if (!process.env.NVIDIA_API_KEY) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY not configured' });
  }

  // Sanitize inputs
  const sanitizedTopic = topic.trim().substring(0, 200);
  const sanitizedConfessions = confessions.map((c) =>
    typeof c === 'string' ? c.substring(0, 2000) : ''
  );

  try {
    const text = await callNvidiaAPI({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: buildUserPrompt({
        topic: sanitizedTopic,
        traps,
        confessions: sanitizedConfessions,
      }),
      maxTokens: 400,
      temperature: 0.6,
    });

    const parsed = parseResponse(text);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Mirror generation error:', err.message);
    return res.status(500).json({ error: 'Failed to generate diagnosis' });
  }
}
