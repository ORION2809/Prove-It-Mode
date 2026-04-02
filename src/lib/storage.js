const STORAGE_KEY = 'prove-it-mode-artifacts';

export function loadArtifacts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveArtifact(artifact) {
  const artifacts = loadArtifacts();
  const updated = [artifact, ...artifacts];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteArtifact(id) {
  const artifacts = loadArtifacts();
  const updated = artifacts.filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function createArtifact({
  topic,
  challenge,
  constraints,
  attempt,
  feedback,
  outcome,
  iterations,
}) {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString().split('T')[0],
    topic,
    challenge,
    constraints,
    attempt,
    feedback,
    outcome,
    iterations,
    status: 'completed',
  };
}
