import { useState, useEffect } from 'react';

export default function MirrorDisplay({ topic, mirror, onStartOver }) {
  const [visibleSections, setVisibleSections] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleSections(1), 400),
      setTimeout(() => setVisibleSections(2), 1200),
      setTimeout(() => setVisibleSections(3), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const hasSolid = mirror.solid && mirror.solid.length > 0;
  const hasBroken = mirror.broken && mirror.broken.length > 0;
  const hasFix = mirror.oneFix && mirror.oneFix.length > 0;

  return (
    <div className="screen-container">
      <div className="screen-content animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2">
            Your mental model
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
            {topic}
          </h2>
        </div>

        {/* Diagnosis cards — staggered reveal */}
        <div className="space-y-4">
          {/* SOLID */}
          {hasSolid && (
            <div
              className={`mirror-card transition-all duration-500 ${
                visibleSections >= 1
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-2">
                    What's solid
                  </p>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {mirror.solid}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BROKEN */}
          {hasBroken && (
            <div
              className={`mirror-card mirror-card-broken transition-all duration-500 ${
                visibleSections >= 2
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-red-500/15 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-2">
                    Where it breaks
                  </p>
                  <p className="text-zinc-200 text-sm leading-relaxed font-medium">
                    {mirror.broken}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ONE FIX */}
          {hasFix && (
            <div
              className={`mirror-card mirror-card-fix transition-all duration-500 ${
                visibleSections >= 3
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
                    One thing to fix before you build
                  </p>
                  <p className="text-zinc-100 text-sm leading-relaxed font-medium">
                    {mirror.oneFix}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div
          className={`mt-12 text-center transition-all duration-500 ${
            visibleSections >= 3
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <button onClick={onStartOver} className="btn-secondary">
            Stress test another topic
          </button>
          <p className="mt-6 text-xs text-zinc-600">
            No score. No history. Just clarity.
          </p>
        </div>
      </div>
    </div>
  );
}
