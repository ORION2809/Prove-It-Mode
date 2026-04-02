import { useState, useEffect } from 'react';

export default function Timer({ startTime }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  // Visual warning at 50 min, but non-enforced
  const isWarning = minutes >= 50;
  const isOvertime = minutes >= 60;

  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono
        ${isOvertime
          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
          : isWarning
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            : 'bg-surface-800 text-zinc-400 border border-surface-700'
        }
      `}
    >
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
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
