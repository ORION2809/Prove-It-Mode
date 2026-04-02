export default function Landing({ onStart, onViewHistory }) {
  return (
    <div className="screen-container">
      <div className="screen-content text-center animate-fade-in">
        {/* Logo mark */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-6">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
        </div>

        {/* Hero */}
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-balance leading-[1.1] mb-6">
          <span className="text-accent">Prove It</span> Mode
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-md mx-auto mb-4 leading-relaxed text-balance">
          You just learned something.
          <br />
          Now prove you can build with it.
        </p>

        <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-12">
          Constraint-loaded challenges. Real feedback. Proof you built something
          — without a tutorial.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onStart} className="btn-primary text-lg px-10 py-4">
            Enter Prove It Mode
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
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <button onClick={onViewHistory} className="btn-ghost">
            View Build History
          </button>
        </div>

        {/* Social proof hint */}
        <p className="mt-16 text-xs text-zinc-600">
          No signup required. Just type what you learned and go.
        </p>
      </div>
    </div>
  );
}
