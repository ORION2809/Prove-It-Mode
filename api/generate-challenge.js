import { callNvidiaAPI } from './_nvidia.js';

const SYSTEM_PROMPT = `You are a senior software mentor. You generate brutally scoped, real-world mini-challenges with constraint sets.

You MUST respond in EXACTLY this format — no extra text:
CHALLENGE: [2-3 sentences]
MUST USE: [one thing]
CANNOT USE: [one thing]
MUST HANDLE: [one edge case]
DELIVERABLE: [exactly what they produce]
HINT: [one sentence — just enough to unblock, not enough to solve]`;

function buildUserPrompt(topic) {
  return `A learner just studied: "${topic}".

First, silently infer their experience level from the topic phrasing:
- If the topic is a general concept or they say "just started" → BEGINNER
  → Use soft constraints: one restriction, a forgiving edge case
- If the topic includes a specific method or hook name → INTERMEDIATE
  → Use stricter tradeoffs: a meaningful cannot-use, a real edge case
- If the topic includes a specific design pattern or architecture → ADVANCED
  → Use conflicting constraints: two rules that create genuine tension

Do NOT mention the difficulty level in your output. Just apply it.

Generate ONE brutally scoped, real-world mini-challenge. It must:
- Be attemptable in 60 minutes by someone at the inferred level
- Produce something small but genuinely useful (not a toy)
- Use ${topic} as the core mechanism
- Feel like a real task someone would actually need — not an exercise, not a demo

Then generate a CONSTRAINT SET calibrated to the inferred level:
- MUST USE: [specific feature/method from ${topic}]
- CANNOT USE: [one shortcut or library they'd naturally reach for]
- MUST HANDLE: [one real-world edge case, harder if advanced]
- DELIVERABLE: [one specific, showable output]

Format your response exactly as:
CHALLENGE: [2–3 sentences]
MUST USE: [one thing]
CANNOT USE: [one thing]
MUST HANDLE: [one edge case]
DELIVERABLE: [exactly what they produce]
HINT: [one sentence — just enough to unblock, not enough to solve]

Do not explain concepts. Do not give a tutorial. Do not suggest resources.`;
}

function parseResponse(text) {
  const lines = text.trim().split('\n');
  const result = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('CHALLENGE:')) {
      result.challenge = trimmed.replace('CHALLENGE:', '').trim();
    } else if (trimmed.startsWith('MUST USE:')) {
      result.mustUse = trimmed.replace('MUST USE:', '').trim();
    } else if (trimmed.startsWith('CANNOT USE:')) {
      result.cannotUse = trimmed.replace('CANNOT USE:', '').trim();
    } else if (trimmed.startsWith('MUST HANDLE:')) {
      result.mustHandle = trimmed.replace('MUST HANDLE:', '').trim();
    } else if (trimmed.startsWith('DELIVERABLE:')) {
      result.deliverable = trimmed.replace('DELIVERABLE:', '').trim();
    } else if (trimmed.startsWith('HINT:')) {
      result.hint = trimmed.replace('HINT:', '').trim();
    }
  }

  // Validate all fields present
  const required = ['challenge', 'mustUse', 'cannotUse', 'mustHandle', 'deliverable', 'hint'];
  for (const field of required) {
    if (!result[field]) {
      throw new Error(`Missing field: ${field}`);
    }
  }

  return result;
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body || {};

  if (!topic || typeof topic !== 'string' || topic.trim().length < 2) {
    return res.status(400).json({ error: 'Topic is required (min 2 characters)' });
  }

  // Sanitize: limit topic length
  const sanitizedTopic = topic.trim().substring(0, 200);

  if (!process.env.NVIDIA_API_KEY) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY not configured' });
  }

  try {
    const text = await callNvidiaAPI({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: buildUserPrompt(sanitizedTopic),
      maxTokens: 500,
      temperature: 0.7,
    });

    const parsed = parseResponse(text);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Challenge generation error:', err.message);
    return res.status(500).json({ error: 'Failed to generate challenge' });
  }
}
