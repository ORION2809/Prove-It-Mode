import { useState, useMemo } from 'react';
import { loadArtifacts, deleteArtifact } from '../lib/storage.js';

export default function History({ onNewChallenge, onGoHome }) {
  const [artifacts, setArtifacts] = useState(() => loadArtifacts());
  const [expandedId, setExpandedId] = useState(null);

  const isEmpty = artifacts.length === 0;

  function handleDelete(id) {
    const updated = deleteArtifact(id);
    setArtifacts(updated);
    if (expandedId === id) setExpandedId(null);
  }

  // Group by month
  const grouped = useMemo(() => {
    const groups = {};
    for (const a of artifacts) {
      const key = a.date.substring(0, 7); // YYYY-MM
      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [artifacts]);

  return (
    <div className="screen-container !justify-start !pt-8">
      <div className="screen-content animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          {!isEmpty && (
            <>
              <p className="text-lg text-zinc-400 mb-1">
                You didn't just learn.
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100">
                You built these.
              </h2>
              <p className="text-sm text-zinc-500 mt-3">
                {artifacts.length} {artifacts.length === 1 ? 'challenge' : 'challenges'} completed
              </p>
            </>
          )}
          {isEmpty && (
            <>
              <h2 className="text-3xl font-bold text-zinc-100 mb-3">
                No builds yet
              </h2>
              <p className="text-zinc-400 mb-8">
                Complete your first challenge to see it here.
              </p>
            </>
          )}
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div className="text-center">
            <button onClick={onNewChallenge} className="btn-primary">
              Start Your First Challenge
            </button>
          </div>
        )}

        {/* Artifact list */}
        {!isEmpty && (
          <div className="space-y-8 mb-10">
            {grouped.map(([monthKey, items]) => (
              <div key={monthKey}>
                <p className="section-label mb-3">
                  {formatMonth(monthKey)}
                </p>
                <div className="space-y-3">
                  {items.map((artifact) => (
                    <ArtifactCard
                      key={artifact.id}
                      artifact={artifact}
                      isExpanded={expandedId === artifact.id}
                      onToggle={() =>
                        setExpandedId(
                          expandedId === artifact.id ? null : artifact.id,
                        )
                      }
                      onDelete={() => handleDelete(artifact.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-center gap-4 pt-6 border-t border-surface-700">
          <button onClick={onGoHome} className="btn-ghost">
            Home
          </button>
          <button onClick={onNewChallenge} className="btn-primary">
            New Challenge
          </button>
        </div>
      </div>
    </div>
  );
}

function ArtifactCard({ artifact, isExpanded, onToggle, onDelete }) {
  return (
    <div className="card !p-0 overflow-hidden">
      {/* Summary row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-surface-700/50 transition-colors"
        aria-expanded={isExpanded}
      >
        {/* Check icon */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-accent"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-200 truncate">
            Built: {artifact.outcome}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {artifact.topic} &middot; {artifact.date}
            {artifact.iterations > 1 &&
              ` · ${artifact.iterations} iterations`}
          </p>
        </div>

        {/* Chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-zinc-500 transition-transform duration-200 flex-shrink-0 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-0 border-t border-surface-700 animate-fade-in">
          <div className="pt-4 space-y-4">
            {/* Challenge */}
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Challenge
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {artifact.challenge}
              </p>
            </div>

            {/* Constraints */}
            <div className="flex flex-wrap gap-2">
              {artifact.constraints && (
                <>
                  <span className="constraint-badge bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-xs">
                    {artifact.constraints.mustUse}
                  </span>
                  <span className="constraint-badge bg-red-500/10 border-red-500/20 text-red-400 text-xs">
                    No: {artifact.constraints.cannotUse}
                  </span>
                </>
              )}
            </div>

            {/* Code preview */}
            {artifact.attempt && (
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  Your Code
                </p>
                <pre className="text-xs text-zinc-400 font-mono bg-surface-900 rounded-lg p-3 overflow-x-auto max-h-40">
                  {artifact.attempt}
                </pre>
              </div>
            )}

            {/* Delete */}
            <div className="flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatMonth(key) {
  const [year, month] = key.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
