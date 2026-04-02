export default function ArtifactSaved({
  artifact,
  onNewChallenge,
  onViewHistory,
}) {
  if (!artifact) return null;

  return (
    <div className="screen-container">
      <div className="screen-content text-center animate-fade-in-up">
        {/* Success icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/30">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Outcome */}
        <p className="text-sm text-zinc-500 uppercase tracking-widest mb-3">
          You built
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-2 text-balance">
          {artifact.outcome}
        </h2>
        <p className="text-sm text-zinc-500 mb-2">
          ({artifact.topic})
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mt-6 mb-10 text-sm text-zinc-400">
          <div className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            {artifact.iterations} {artifact.iterations === 1 ? 'iteration' : 'iterations'}
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {artifact.date}
          </div>
        </div>

        {/* Proof statement */}
        <div className="card max-w-md mx-auto mb-10">
          <p className="text-zinc-300 text-sm leading-relaxed italic">
            "No tutorial. No copying. Just you, the constraints, and a blank
            editor."
          </p>
          <p className="text-zinc-500 text-xs mt-3">
            — That's proof.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onNewChallenge} className="btn-primary">
            New Challenge
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <button onClick={onViewHistory} className="btn-secondary">
            View Build History
          </button>
        </div>
      </div>
    </div>
  );
}
