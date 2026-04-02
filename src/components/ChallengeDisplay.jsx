export default function ChallengeDisplay({ challenge, error, onBegin }) {
  if (!challenge) return null;

  return (
    <div className="screen-container">
      <div className="screen-content animate-fade-in-up">
        {/* Error banner for fallback */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm text-center">
            Using a pre-cached challenge — AI generation will retry next time.
          </div>
        )}

        {/* Section label */}
        <p className="section-label">Your Challenge</p>

        {/* Challenge text */}
        <div className="card mb-8">
          <p className="text-lg sm:text-xl text-zinc-100 leading-relaxed font-medium">
            {challenge.challenge}
          </p>
        </div>

        {/* Constraints */}
        <p className="section-label">Constraints</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <ConstraintCard
            label="Must Use"
            value={challenge.mustUse}
            color="emerald"
          />
          <ConstraintCard
            label="Cannot Use"
            value={challenge.cannotUse}
            color="red"
          />
          <ConstraintCard
            label="Must Handle"
            value={challenge.mustHandle}
            color="amber"
          />
          <ConstraintCard
            label="Deliverable"
            value={challenge.deliverable}
            color="blue"
          />
        </div>

        {/* Hint */}
        {challenge.hint && (
          <details className="mb-8 group">
            <summary className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-400 transition-colors">
              <span className="ml-1">Show hint (use only if stuck)</span>
            </summary>
            <p className="mt-3 text-sm text-zinc-400 pl-5 border-l-2 border-surface-700">
              {challenge.hint}
            </p>
          </details>
        )}

        {/* Start button */}
        <div className="flex justify-center">
          <button onClick={onBegin} className="btn-primary text-lg px-10 py-4">
            Start Building
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function ConstraintCard({ label, value, color }) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      label: 'text-emerald-400',
      dot: 'bg-emerald-400',
    },
    red: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      label: 'text-red-400',
      dot: 'bg-red-400',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      label: 'text-amber-400',
      dot: 'bg-amber-400',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      label: 'text-blue-400',
      dot: 'bg-blue-400',
    },
  };

  const c = colorMap[color] || colorMap.amber;

  return (
    <div className={`rounded-xl p-4 ${c.bg} border ${c.border}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${c.label}`}>
          {label}
        </span>
      </div>
      <p className="text-sm text-zinc-200 leading-relaxed">{value}</p>
    </div>
  );
}
