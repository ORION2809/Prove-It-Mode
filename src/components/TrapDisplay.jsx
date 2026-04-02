import { useState } from 'react';

export default function TrapDisplay({ trap, confessions, onUpdateConfession, onSubmit, error }) {
  const [activeSnippet, setActiveSnippet] = useState(0);

  const allAnswered = confessions.every((c) => c.trim().length > 0);
  const currentAnswered = confessions[activeSnippet].trim().length > 0;

  return (
    <div className="screen-container">
      <div className="screen-content animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-3">
            Something's wrong with each of these
          </p>
          <p className="text-sm text-zinc-500">
            What is it? Explain in your own words.
          </p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Snippet tabs */}
        <div className="flex gap-2 mb-6 justify-center">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setActiveSnippet(i)}
              className={`
                relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeSnippet === i
                  ? 'bg-surface-800 text-zinc-100 border border-surface-600'
                  : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                }
              `}
            >
              Snippet {i + 1}
              {confessions[i].trim().length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent" />
              )}
            </button>
          ))}
        </div>

        {/* Active snippet */}
        <div className="space-y-4" key={activeSnippet}>
          <div className="code-snippet-card">
            <pre className="text-sm font-mono text-zinc-200 leading-relaxed whitespace-pre-wrap break-words">
              {trap.snippets[activeSnippet]}
            </pre>
          </div>

          {/* Confession textarea */}
          <div>
            <textarea
              value={confessions[activeSnippet]}
              onChange={(e) => onUpdateConfession(activeSnippet, e.target.value)}
              placeholder="What's wrong here? Be specific — say what you actually think, not what sounds smart."
              className="confession-textarea"
              rows={4}
              maxLength={2000}
              aria-label={`Your explanation for snippet ${activeSnippet + 1}`}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-zinc-600">
                {confessions[activeSnippet].length > 0 && `${confessions[activeSnippet].length} chars`}
              </p>
              {currentAnswered && activeSnippet < 2 && (
                <button
                  onClick={() => setActiveSnippet(activeSnippet + 1)}
                  className="text-xs text-accent hover:text-accent-hover transition-colors"
                >
                  Next snippet →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress + submit */}
        <div className="mt-8 space-y-4">
          {/* Progress dots */}
          <div className="flex justify-center gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  confessions[i].trim().length > 0
                    ? 'bg-accent'
                    : 'bg-surface-700'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={onSubmit}
              disabled={!allAnswered}
              className="btn-primary"
            >
              {allAnswered ? 'Show me what I missed' : `${confessions.filter(c => c.trim()).length}/3 answered`}
            </button>
          </div>

          {!allAnswered && (
            <p className="text-xs text-zinc-600 text-center">
              Answer all three. Even "I have no idea" counts — honesty reveals more than guessing.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
