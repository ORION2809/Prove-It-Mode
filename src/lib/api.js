import { getFallbackChallenge } from './fallbacks.js';

const API_TIMEOUT = 15000;

async function fetchWithTimeout(url, options, timeout = API_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export async function generateChallenge(topic) {
  try {
    const response = await fetchWithTimeout('/api/generate-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    console.warn('Challenge API failed, using fallback:', err.message);
    const fallback = getFallbackChallenge(topic);
    return { success: false, data: fallback, fallback: true };
  }
}

export async function generateFeedback({
  challenge,
  constraints,
  attempt,
  previousFeedback,
}) {
  try {
    const response = await fetchWithTimeout('/api/generate-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challenge,
        constraints,
        attempt,
        previousFeedback,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch {
    return {
      success: false,
      error:
        "Couldn't generate feedback right now.\nYour attempt has been saved.\nTry submitting again in a moment.",
    };
  }
}

export async function generateOutcome(challenge, attempt) {
  try {
    const response = await fetchWithTimeout('/api/generate-outcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challenge: challenge.challenge,
        attempt: attempt.substring(0, 300),
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.outcome;
  } catch {
    // Generate a simple fallback outcome from the challenge text
    const words = challenge.challenge.split(' ').slice(0, 6).join(' ');
    return words.length > 30 ? words.substring(0, 30) : words;
  }
}
