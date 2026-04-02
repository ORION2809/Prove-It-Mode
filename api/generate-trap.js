import { callNvidiaAPI } from './_nvidia.js';

const SYSTEM_PROMPT = `You are a senior software educator who specializes in revealing misconceptions. You create code snippets that look correct but contain subtle conceptual errors — the kind of mistakes someone makes when they half-understood something from a tutorial.

You MUST respond in EXACTLY this format — no extra text:
SNIPPET_1: [code or statement]
WRONG_BECAUSE_1: [what the actual conceptual error is]
SNIPPET_2: [code or statement]
WRONG_BECAUSE_2: [what the actual conceptual error is]
SNIPPET_3: [code or statement]
WRONG_BECAUSE_3: [what the actual conceptual error is]`;

function buildUserPrompt(topic) {
  return `A learner just studied: "${topic}".

Generate exactly 3 code snippets or conceptual statements about ${topic}.

Rules for each:
- Each must look plausible at first glance — a learner who half-understood would accept it
- Each must be subtly, specifically WRONG in a conceptually meaningful way
- The wrongness must NOT be a syntax error — it must be a conceptual misunderstanding
- Each must test a DIFFERENT aspect of ${topic}
- Each wrong should represent a different common misconception beginners have
- Keep each snippet short (3-8 lines of code or 1-2 sentence statement)

Format EXACTLY as:
SNIPPET_1: [the code or statement]
WRONG_BECAUSE_1: [internal note — what the actual error is]
SNIPPET_2: [the code or statement]
WRONG_BECAUSE_2: [internal note]
SNIPPET_3: [the code or statement]
WRONG_BECAUSE_3: [internal note]

Do not label them as wrong. Do not add any explanation. Just the snippets and internal notes.`;
}

function parseResponse(text) {
  const result = { snippets: [], wrongBecause: [] };

  const lines = text.trim().split('\n');
  let currentKey = null;
  let currentValue = '';

  for (const line of lines) {
    const trimmed = line.trim();

    for (let i = 1; i <= 3; i++) {
      if (trimmed.startsWith(`SNIPPET_${i}:`)) {
        if (currentKey) {
          pushParsed(result, currentKey, currentValue.trim());
        }
        currentKey = `SNIPPET_${i}`;
        currentValue = trimmed.replace(`SNIPPET_${i}:`, '').trim();
        break;
      }
      if (trimmed.startsWith(`WRONG_BECAUSE_${i}:`)) {
        if (currentKey) {
          pushParsed(result, currentKey, currentValue.trim());
        }
        currentKey = `WRONG_BECAUSE_${i}`;
        currentValue = trimmed.replace(`WRONG_BECAUSE_${i}:`, '').trim();
        break;
      }
    }

    // If no key match, this line continues the previous value
    if (currentKey && !lineStartsWithKey(trimmed)) {
      currentValue += '\n' + trimmed;
    }
  }

  // Push the last accumulated value
  if (currentKey) {
    pushParsed(result, currentKey, currentValue.trim());
  }

  if (result.snippets.length < 3 || result.wrongBecause.length < 3) {
    throw new Error('Incomplete response: expected 3 snippets and 3 reasons');
  }

  return result;
}

function lineStartsWithKey(line) {
  for (let i = 1; i <= 3; i++) {
    if (line.startsWith(`SNIPPET_${i}:`) || line.startsWith(`WRONG_BECAUSE_${i}:`)) {
      return true;
    }
  }
  return false;
}

function pushParsed(result, key, value) {
  if (key.startsWith('SNIPPET_')) {
    result.snippets.push(value);
  } else if (key.startsWith('WRONG_BECAUSE_')) {
    result.wrongBecause.push(value);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body || {};

  if (!topic || typeof topic !== 'string' || topic.trim().length < 2) {
    return res.status(400).json({ error: 'Topic is required (min 2 characters)' });
  }

  const sanitizedTopic = topic.trim().substring(0, 200);

  if (!process.env.NVIDIA_API_KEY) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY not configured' });
  }

  try {
    const text = await callNvidiaAPI({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: buildUserPrompt(sanitizedTopic),
      maxTokens: 800,
      temperature: 0.7,
    });

    const parsed = parseResponse(text);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Trap generation error:', err.message);
    return res.status(500).json({ error: 'Failed to generate traps' });
  }
}
