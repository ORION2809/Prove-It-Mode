export default function Landing({ onStart }) {
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>

        {/* Hero */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance leading-[1.1] mb-6">
          You think you
          <br />
          <span className="text-accent">understand it.</span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-md mx-auto mb-4 leading-relaxed text-balance">
          Find out exactly where your understanding breaks — before you open your editor and discover it the hard way.
        </p>

        <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-12">
          Not a quiz. Not a challenge. A mirror for your mental model.
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center justify-center gap-4">
          <button onClick={onStart} className="btn-primary text-lg px-10 py-4">
            Stress test my understanding
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
        </div>

        {/* Social proof hint */}
        <p className="mt-16 text-xs text-zinc-600">
          No signup. No score. Takes under 5 minutes.
        </p>
      </div>
    </div>
  );
}
