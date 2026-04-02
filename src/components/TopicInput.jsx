import { useState } from 'react';

export default function TopicInput({ onSubmit }) {
  const [topic, setTopic] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = topic.trim();
    if (trimmed.length < 2) return;
    onSubmit(trimmed);
  }

  return (
    <div className="screen-container">
      <div className="screen-content animate-fade-in-up">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            What did you just learn?
          </h2>
          <p className="text-zinc-400 text-base">
            Be specific. The more detail, the sharper the challenge.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder='e.g. "React useEffect hook" or "Python list comprehensions"'
              className="input-field text-center"
              autoFocus
              maxLength={200}
              aria-label="Topic you just learned"
            />
            <p className="mt-2 text-xs text-zinc-600 text-center">
              {topic.length > 0 && `${topic.length}/200`}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={topic.trim().length < 2}
              className="btn-primary"
            >
              Prove It
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
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </form>

        {/* Examples */}
        <div className="mt-16">
          <p className="section-label text-center">Examples</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'React useEffect hook',
              'Python list comprehensions',
              'SQL JOINs',
              'CSS Flexbox',
              'async/await in JavaScript',
            ].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setTopic(example)}
                className="px-3 py-1.5 text-xs text-zinc-400 bg-surface-800 
                           border border-surface-700 rounded-lg 
                           hover:text-zinc-200 hover:border-surface-600 
                           transition-all duration-150"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
