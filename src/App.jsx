import { useCallback, useEffect, useRef } from 'react';
import { useAppState, SCREENS } from './hooks/useAppState.js';
import { generateTrap, generateMirror } from './lib/api.js';

import Landing from './components/Landing.jsx';
import TopicInput from './components/TopicInput.jsx';
import Framing from './components/Framing.jsx';
import TrapDisplay from './components/TrapDisplay.jsx';
import MirrorDisplay from './components/MirrorDisplay.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

export default function App() {
  const { state, actions } = useAppState();
  const trapRequestRef = useRef(null);

  const fetchTrap = useCallback(
    async (topic) => {
      const result = await generateTrap(topic);
      return result;
    },
    [],
  );

  // Fire trap generation as soon as topic is submitted — framing buys us time
  const handleTopicSubmit = useCallback(
    (topic) => {
      actions.submitTopic(topic);
      trapRequestRef.current = fetchTrap(topic);
    },
    [actions, fetchTrap],
  );

  // Resolve trap when framing completes
  useEffect(() => {
    if (state.screen === SCREENS.LOADING_TRAP && trapRequestRef.current) {
      const pending = trapRequestRef.current;
      trapRequestRef.current = null;

      pending.then((result) => {
        if (result.success) {
          actions.setTrap(result.data);
        } else {
          actions.setTrapError(
            'API unavailable — using a pre-cached set.',
            result.data,
          );
        }
      });
    }
  }, [state.screen, actions]);

  // Handle confession submission → fetch mirror diagnosis
  useEffect(() => {
    if (state.screen !== SCREENS.LOADING_MIRROR) return;
    if (!state.trap || !state.confessions) return;

    generateMirror({
      topic: state.topic,
      traps: state.trap,
      confessions: state.confessions,
    }).then((result) => {
      if (result.success) {
        actions.setMirror(result.data);
      } else {
        actions.setMirrorError(result.error);
      }
    });
  }, [state.screen, state.trap, state.confessions, state.topic, actions]);

  function renderScreen() {
    switch (state.screen) {
      case SCREENS.LANDING:
        return <Landing onStart={actions.start} />;

      case SCREENS.INPUT:
        return <TopicInput onSubmit={handleTopicSubmit} />;

      case SCREENS.FRAMING_BEAT1:
        return (
          <Framing
            topic={state.topic}
            beat={1}
            onAdvance={actions.advanceFraming}
          />
        );

      case SCREENS.FRAMING_BEAT2:
        return (
          <Framing
            topic={state.topic}
            beat={2}
            onAdvance={actions.advanceFraming}
          />
        );

      case SCREENS.LOADING_TRAP:
        return <LoadingScreen message="Setting the traps..." />;

      case SCREENS.TRAP:
        return (
          <TrapDisplay
            trap={state.trap}
            confessions={state.confessions}
            onUpdateConfession={actions.updateConfession}
            onSubmit={actions.submitConfessions}
            error={state.error}
          />
        );

      case SCREENS.LOADING_MIRROR:
        return <LoadingScreen message="Reading between your lines..." />;

      case SCREENS.MIRROR:
        return (
          <MirrorDisplay
            topic={state.topic}
            mirror={state.mirror}
            onStartOver={actions.startOver}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/[0.03] rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10">{renderScreen()}</div>
    </div>
  );
}
