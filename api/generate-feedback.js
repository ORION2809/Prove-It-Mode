import { callNvidiaAPI } from './_nvidia.js';

const SYSTEM_PROMPT = `You are a senior developer doing a code review. Be direct and honest, like a good mentor. Not a cheerleader. Not a judge.

You MUST respond in EXACTLY this format — no extra text, under 150 words total:
WHAT WORKS: [1-2 specific things]
WHAT'S MISSING OR BROKEN: [1-2 concrete issues]
CONSTRAINT CHECK: [Yes/Partial/No + one sentence]
ONE THING TO TRY NEXT: [single specific improvement]`;

function buildUserPrompt({ challenge, constraints, attempt, previousFeedback }) {
  let prompt = `CHALLENGE: "${challenge}"
CONSTRAINTS: Must use ${constraints.mustUse}. Cannot use ${constraints.cannotUse}. Must handle ${constraints.mustHandle}.
`;

  if (previousFeedback) {
    prompt += `
PREVIOUS FEEDBACK: "${previousFeedback}"
This is a rewrite — evaluate improvement over the previous attempt.
`;
  }

  prompt += `
THEIR ATTEMPT:
"${attempt}"

Respond in this exact format:
WHAT WORKS: [1–2 specific things — name the actual code/approach]
WHAT'S MISSING OR BROKEN: [1–2 concrete issues — be direct, not mean]
CONSTRAINT CHECK: [Did they meet the constraints? Yes/Partial/No + one sentence]
ONE THING TO TRY NEXT: [Single specific improvement — not a lesson, an action]

Tone: Direct and honest, like a good mentor. Not a cheerleader. Not a judge.
Under 150 words total. No code samples unless critical.`;

  return prompt;
}

function parseResponse(text) {
  const lines = text.trim().split('\n');
  const result = {
    whatWorks: '',
    whatsMissing: '',
    constraintCheck: '',
    nextStep: '',
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('WHAT WORKS:')) {
      result.whatWorks = trimmed.replace('WHAT WORKS:', '').trim();
    } else if (trimmed.startsWith("WHAT'S MISSING OR BROKEN:") || trimmed.startsWith("WHAT'S MISSING:")) {
      result.whatsMissing = trimmed.replace(/WHAT'S MISSING( OR BROKEN)?:/, '').trim();
    } else if (trimmed.startsWith('CONSTRAINT CHECK:')) {
      result.constraintCheck = trimmed.replace('CONSTRAINT CHECK:', '').trim();
    } else if (trimmed.startsWith('ONE THING TO TRY NEXT:')) {
      result.nextStep = trimmed.replace('ONE THING TO TRY NEXT:', '').trim();
    }
  }

  return result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { challenge, constraints, attempt, previousFeedback } = req.body || {};

  if (!challenge || !constraints || !attempt) {
    return res.status(400).json({ error: 'Missing required fields: challenge, constraints, attempt' });
  }

  if (typeof attempt !== 'string' || attempt.trim().length < 10) {
    return res.status(400).json({ error: 'Attempt must be at least 10 characters' });
  }

  if (!process.env.NVIDIA_API_KEY) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY not configured' });
  }

  // Limit attempt size to prevent abuse
  const sanitizedAttempt = attempt.substring(0, 5000);

  try {
    const text = await callNvidiaAPI({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: buildUserPrompt({
        challenge,
        constraints,
        attempt: sanitizedAttempt,
        previousFeedback: previousFeedback?.substring(0, 1000),
      }),
      maxTokens: 400,
      temperature: 0.6,
    });

    const parsed = parseResponse(text);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Feedback generation error:', err.message);
    return res.status(500).json({ error: 'Failed to generate feedback' });
  }
}
