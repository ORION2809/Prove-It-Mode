import Timer from './Timer.jsx';

export default function AttemptEditor({
  topic,
  challenge,
  attempt,
  onUpdate,
  onSubmit,
  timerStart,
  previousFeedback,
}) {
  const lineCount = (attempt.match(/\n/g) || []).length + 1;
  const canSubmit = attempt.trim().length >= 10;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  }

  return (
    <div className="screen-container !justify-start !pt-8">
      <div className="screen-content animate-fade-in">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="section-label mb-0">Your Attempt</p>
            <p className="text-sm text-zinc-500 mt-1">
              {topic} — {challenge?.deliverable}
            </p>
          </div>
          {timerStart && <Timer startTime={timerStart} />}
        </div>

        {/* Previous feedback context */}
        {previousFeedback && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-accent/5 border border-accent/10">
            <p className="text-xs font-semibold text-accent mb-1 uppercase tracking-wider">
              Previous Feedback — Improve on this
            </p>
            <p className="text-xs text-zinc-400 whitespace-pre-line leading-relaxed">
              {previousFeedback}
            </p>
          </div>
        )}

        {/* Constraint reminder */}
        <div className="flex flex-wrap gap-2 mb-4">
          {challenge && (
            <>
              <span className="constraint-badge bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                Use: {challenge.mustUse}
              </span>
              <span className="constraint-badge bg-red-500/10 border-red-500/20 text-red-400">
                No: {challenge.cannotUse}
              </span>
            </>
          )}
        </div>

        {/* Editor */}
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={attempt}
              onChange={(e) => onUpdate(e.target.value)}
              placeholder="Write your code here... No tutorials. No copying. Just you and the constraints."
              className="code-editor min-h-[400px]"
              autoFocus
              spellCheck={false}
              aria-label="Code attempt editor"
            />

            {/* Line/char count */}
            <div className="absolute bottom-3 right-4 flex items-center gap-3 text-xs text-zinc-600">
              <span>{lineCount} lines</span>
              <span>{attempt.length} chars</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-zinc-600">
              {canSubmit
                ? 'Ready to submit'
                : 'Write at least 10 characters to submit'}
            </p>

            <button
              type="submit"
              disabled={!canSubmit}
              className="btn-primary"
            >
              Submit for Review
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
