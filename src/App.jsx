import { useCallback, useEffect, useRef } from 'react';
import { useAppState, SCREENS } from './hooks/useAppState.js';
import { generateChallenge, generateFeedback, generateOutcome } from './lib/api.js';
import { createArtifact, saveArtifact } from './lib/storage.js';

import Landing from './components/Landing.jsx';
import TopicInput from './components/TopicInput.jsx';
import Framing from './components/Framing.jsx';
import ChallengeDisplay from './components/ChallengeDisplay.jsx';
import AttemptEditor from './components/AttemptEditor.jsx';
import FeedbackDisplay from './components/FeedbackDisplay.jsx';
import ArtifactSaved from './components/ArtifactSaved.jsx';
import History from './components/History.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

export default function App() {
  const { state, actions } = useAppState();
  const challengeRequestRef = useRef(null);

  // Start fetching challenge during framing screens
  const fetchChallenge = useCallback(
    async (topic) => {
      const result = await generateChallenge(topic);
      return result;
    },
    [],
  );

  // When topic is submitted, kick off challenge generation in parallel with framing
  const handleTopicSubmit = useCallback(
    (topic) => {
      actions.submitTopic(topic);
      // Start fetching immediately — framing screens buy us time
      challengeRequestRef.current = fetchChallenge(topic);
    },
    [actions, fetchChallenge],
  );

  // When framing completes (beat 2 → loading), resolve the challenge
  useEffect(() => {
    if (state.screen === SCREENS.LOADING_CHALLENGE && challengeRequestRef.current) {
      const pending = challengeRequestRef.current;
      challengeRequestRef.current = null;

      pending.then((result) => {
        if (result.success) {
          actions.setChallenge(result.data);
        } else {
          actions.setChallengeError(
            'API unavailable — using a pre-cached challenge.',
            result.data,
          );
        }
      });
    }
  }, [state.screen, actions]);

  // Handle attempt submission → fetch feedback
  useEffect(() => {
    if (state.screen !== SCREENS.LOADING_FEEDBACK) return;
    if (!state.challenge || !state.attempt) return;

    generateFeedback({
      challenge: state.challenge.challenge,
      constraints: {
        mustUse: state.challenge.mustUse,
        cannotUse: state.challenge.cannotUse,
        mustHandle: state.challenge.mustHandle,
      },
      attempt: state.attempt,
      previousFeedback: state.previousFeedback,
    }).then((result) => {
      if (result.success) {
        actions.setFeedback(result.data);
      } else {
        actions.setFeedbackError(result.error);
      }
    });
  }, [state.screen, state.challenge, state.attempt, state.previousFeedback, actions]);

  // Handle artifact save
  useEffect(() => {
    if (state.screen !== SCREENS.SAVING_ARTIFACT) return;

    const save = async () => {
      const outcome = await generateOutcome(state.challenge, state.attempt);
      const artifact = createArtifact({
        topic: state.topic,
        challenge: state.challenge.challenge,
        constraints: {
          mustUse: state.challenge.mustUse,
          cannotUse: state.challenge.cannotUse,
          mustHandle: state.challenge.mustHandle,
        },
        attempt: state.attempt,
        feedback: state.feedback,
        outcome,
        iterations: state.iterations,
      });
      saveArtifact(artifact);
      actions.setArtifactSaved(artifact);
    };

    save();
  }, [state.screen, state.challenge, state.attempt, state.feedback, state.topic, state.iterations, actions]);

  // Render current screen
  function renderScreen() {
    switch (state.screen) {
      case SCREENS.LANDING:
        return (
          <Landing
            onStart={actions.start}
            onViewHistory={actions.viewHistory}
          />
        );

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

      case SCREENS.LOADING_CHALLENGE:
        return <LoadingScreen message="Crafting your challenge..." />;

      case SCREENS.CHALLENGE:
        return (
          <ChallengeDisplay
            challenge={state.challenge}
            error={state.error}
            onBegin={actions.beginAttempt}
          />
        );

      case SCREENS.ATTEMPT:
        return (
          <AttemptEditor
            topic={state.topic}
            challenge={state.challenge}
            attempt={state.attempt}
            onUpdate={actions.updateAttempt}
            onSubmit={actions.submitAttempt}
            timerStart={state.timerStart}
            previousFeedback={state.previousFeedback}
          />
        );

      case SCREENS.LOADING_FEEDBACK:
        return <LoadingScreen message="Reviewing your code..." />;

      case SCREENS.FEEDBACK:
        return (
          <FeedbackDisplay
            feedback={state.feedback}
            error={state.error}
            iterations={state.iterations}
            onTryAgain={actions.tryAgain}
            onSave={actions.saveArtifact}
          />
        );

      case SCREENS.SAVING_ARTIFACT:
        return <LoadingScreen message="Saving your build..." />;

      case SCREENS.ARTIFACT_SAVED:
        return (
          <ArtifactSaved
            artifact={state.savedArtifact}
            onNewChallenge={actions.newChallenge}
            onViewHistory={actions.viewHistory}
          />
        );

      case SCREENS.HISTORY:
        return (
          <History
            onNewChallenge={actions.newChallenge}
            onGoHome={actions.goHome}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">{renderScreen()}</div>
    </div>
  );
}
