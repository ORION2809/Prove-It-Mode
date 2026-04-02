import { getFallbackTrap } from './fallbacks.js';

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

export async function generateTrap(topic) {
  try {
    const response = await fetchWithTimeout('/api/generate-trap', {
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
    console.warn('Trap API failed, using fallback:', err.message);
    const fallback = getFallbackTrap(topic);
    return { success: false, data: fallback, fallback: true };
  }
}

export async function generateMirror({ topic, traps, confessions }) {
  try {
    const response = await fetchWithTimeout('/api/generate-mirror', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, traps, confessions }),
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
        "Couldn't generate your diagnosis right now.\nTry submitting again — your explanations are still here.",
    };
  }
}
