import { useEffect, useState } from 'react';

export default function Framing({ topic, beat, onAdvance }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in after mount
    const fadeTimer = setTimeout(() => setVisible(true), 50);

    // Auto-advance after delay
    const advanceDelay = beat === 1 ? 2000 : 2500;
    const advanceTimer = setTimeout(onAdvance, advanceDelay);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(advanceTimer);
    };
  }, [beat, onAdvance]);

  return (
    <div className="screen-container">
      <div
        className="screen-content text-center transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {beat === 1 ? (
          <div key="beat1">
            <p className="text-zinc-500 text-sm uppercase tracking-widest mb-6">
              You just studied
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-accent mb-8 text-balance">
              {topic}
            </p>
            <p className="text-xl sm:text-2xl text-zinc-200 font-medium">
              You think you understand it.
            </p>
            <p className="text-lg text-zinc-400 mt-2">
              Let's find out where you actually do.
            </p>
          </div>
        ) : (
          <div key="beat2">
            <p className="text-2xl sm:text-3xl text-zinc-300 font-medium leading-relaxed">
              You won't feel ready.
            </p>
            <p className="text-2xl sm:text-3xl text-zinc-100 font-semibold mt-3">
              Start anyway.
            </p>

            {/* Subtle progress indicator */}
            <div className="mt-12 flex justify-center">
              <div className="w-12 h-0.5 bg-accent/30 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full animate-[loading_2.5s_ease-in-out]" 
                     style={{ 
                       animation: 'loading 2.5s ease-in-out forwards',
                     }} 
                />
              </div>
            </div>
            <style>{`
              @keyframes loading {
                0% { width: 0%; }
                100% { width: 100%; }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
