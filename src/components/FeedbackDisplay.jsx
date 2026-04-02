export default function FeedbackDisplay({
  feedback,
  error,
  iterations,
  onTryAgain,
  onSave,
}) {
  // Error state — attempt preserved
  if (error) {
    return (
      <div className="screen-container">
        <div className="screen-content animate-fade-in text-center">
          <div className="card max-w-md mx-auto">
            <div className="text-amber-400 mb-4">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-zinc-200 whitespace-pre-line leading-relaxed">
              {error}
            </p>
          </div>
          <button onClick={onTryAgain} className="btn-primary mt-8">
            Try Submitting Again
          </button>
        </div>
      </div>
    );
  }

  if (!feedback) return null;

  return (
    <div className="screen-container !justify-start !pt-8">
      <div className="screen-content animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-label mb-0">Code Review</p>
            <p className="text-sm text-zinc-500 mt-1">
              Iteration {iterations}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Senior Dev Review
          </div>
        </div>

        {/* Feedback sections */}
        <div className="space-y-4 mb-10">
          <FeedbackSection
            icon="check"
            label="What Works"
            content={feedback.whatWorks}
            color="emerald"
          />
          <FeedbackSection
            icon="x"
            label="What's Missing or Broken"
            content={feedback.whatsMissing}
            color="red"
          />
          <FeedbackSection
            icon="target"
            label="Constraint Check"
            content={feedback.constraintCheck}
            color="amber"
          />
          <FeedbackSection
            icon="arrow-right"
            label="One Thing to Try Next"
            content={feedback.nextStep}
            color="blue"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-surface-700">
          <button onClick={onTryAgain} className="btn-secondary">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Try Again
          </button>

          <button onClick={onSave} className="btn-primary">
            Save &amp; Finish
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedbackSection({ label, content, color, icon }) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/15',
      label: 'text-emerald-400',
      icon: 'text-emerald-400',
    },
    red: {
      bg: 'bg-red-500/5',
      border: 'border-red-500/15',
      label: 'text-red-400',
      icon: 'text-red-400',
    },
    amber: {
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/15',
      label: 'text-amber-400',
      icon: 'text-amber-400',
    },
    blue: {
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/15',
      label: 'text-blue-400',
      icon: 'text-blue-400',
    },
  };

  const c = colorMap[color] || colorMap.amber;

  const icons = {
    check: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    x: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    target: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    'arrow-right': (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
  };

  return (
    <div className={`rounded-xl p-5 ${c.bg} border ${c.border}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={c.icon}>{icons[icon]}</span>
        <span className={`text-xs font-semibold uppercase tracking-wider ${c.label}`}>
          {label}
        </span>
      </div>
      <p className="text-sm text-zinc-200 leading-relaxed">{content}</p>
    </div>
  );
}
