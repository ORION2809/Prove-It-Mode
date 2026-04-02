import { useReducer, useCallback } from 'react';

export const SCREENS = {
  LANDING: 'LANDING',
  INPUT: 'INPUT',
  FRAMING_BEAT1: 'FRAMING_BEAT1',
  FRAMING_BEAT2: 'FRAMING_BEAT2',
  LOADING_CHALLENGE: 'LOADING_CHALLENGE',
  CHALLENGE: 'CHALLENGE',
  ATTEMPT: 'ATTEMPT',
  LOADING_FEEDBACK: 'LOADING_FEEDBACK',
  FEEDBACK: 'FEEDBACK',
  SAVING_ARTIFACT: 'SAVING_ARTIFACT',
  ARTIFACT_SAVED: 'ARTIFACT_SAVED',
  HISTORY: 'HISTORY',
};

const ACTIONS = {
  START: 'START',
  SUBMIT_TOPIC: 'SUBMIT_TOPIC',
  ADVANCE_FRAMING: 'ADVANCE_FRAMING',
  SET_CHALLENGE: 'SET_CHALLENGE',
  SET_CHALLENGE_ERROR: 'SET_CHALLENGE_ERROR',
  BEGIN_ATTEMPT: 'BEGIN_ATTEMPT',
  UPDATE_ATTEMPT: 'UPDATE_ATTEMPT',
  SUBMIT_ATTEMPT: 'SUBMIT_ATTEMPT',
  SET_FEEDBACK: 'SET_FEEDBACK',
  SET_FEEDBACK_ERROR: 'SET_FEEDBACK_ERROR',
  TRY_AGAIN: 'TRY_AGAIN',
  SAVE_ARTIFACT: 'SAVE_ARTIFACT',
  SET_ARTIFACT_SAVED: 'SET_ARTIFACT_SAVED',
  NEW_CHALLENGE: 'NEW_CHALLENGE',
  VIEW_HISTORY: 'VIEW_HISTORY',
  GO_HOME: 'GO_HOME',
};

const initialState = {
  screen: SCREENS.LANDING,
  topic: null,
  challenge: null,
  attempt: '',
  feedback: null,
  previousFeedback: null,
  iterations: 0,
  savedArtifact: null,
  error: null,
  timerStart: null,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.START:
      return { ...state, screen: SCREENS.INPUT, error: null };

    case ACTIONS.SUBMIT_TOPIC:
      return {
        ...state,
        screen: SCREENS.FRAMING_BEAT1,
        topic: action.payload.trim(),
        challenge: null,
        attempt: '',
        feedback: null,
        previousFeedback: null,
        iterations: 0,
        savedArtifact: null,
        error: null,
        timerStart: null,
      };

    case ACTIONS.ADVANCE_FRAMING:
      if (state.screen === SCREENS.FRAMING_BEAT1) {
        return { ...state, screen: SCREENS.FRAMING_BEAT2 };
      }
      return { ...state, screen: SCREENS.LOADING_CHALLENGE };

    case ACTIONS.SET_CHALLENGE:
      return {
        ...state,
        screen: SCREENS.CHALLENGE,
        challenge: action.payload,
        error: null,
      };

    case ACTIONS.SET_CHALLENGE_ERROR:
      return {
        ...state,
        screen: SCREENS.CHALLENGE,
        challenge: action.payload.fallback,
        error: action.payload.message,
      };

    case ACTIONS.BEGIN_ATTEMPT:
      return {
        ...state,
        screen: SCREENS.ATTEMPT,
        timerStart: state.timerStart || Date.now(),
      };

    case ACTIONS.UPDATE_ATTEMPT:
      return { ...state, attempt: action.payload };

    case ACTIONS.SUBMIT_ATTEMPT:
      return { ...state, screen: SCREENS.LOADING_FEEDBACK };

    case ACTIONS.SET_FEEDBACK:
      return {
        ...state,
        screen: SCREENS.FEEDBACK,
        feedback: action.payload,
        iterations: state.iterations + 1,
        error: null,
      };

    case ACTIONS.SET_FEEDBACK_ERROR:
      return {
        ...state,
        screen: SCREENS.FEEDBACK,
        feedback: null,
        error: action.payload,
      };

    case ACTIONS.TRY_AGAIN:
      return {
        ...state,
        screen: SCREENS.ATTEMPT,
        previousFeedback: formatFeedbackForContext(state.feedback),
        feedback: null,
      };

    case ACTIONS.SAVE_ARTIFACT:
      return { ...state, screen: SCREENS.SAVING_ARTIFACT };

    case ACTIONS.SET_ARTIFACT_SAVED:
      return {
        ...state,
        screen: SCREENS.ARTIFACT_SAVED,
        savedArtifact: action.payload,
      };

    case ACTIONS.NEW_CHALLENGE:
      return {
        ...initialState,
        screen: SCREENS.INPUT,
      };

    case ACTIONS.VIEW_HISTORY:
      return { ...state, screen: SCREENS.HISTORY };

    case ACTIONS.GO_HOME:
      return { ...initialState };

    default:
      return state;
  }
}

function formatFeedbackForContext(feedback) {
  if (!feedback) return null;
  return [
    `WHAT WORKS: ${feedback.whatWorks}`,
    `WHAT'S MISSING: ${feedback.whatsMissing}`,
    `CONSTRAINT CHECK: ${feedback.constraintCheck}`,
    `NEXT STEP: ${feedback.nextStep}`,
  ].join('\n');
}

export function useAppState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    start: useCallback(() => dispatch({ type: ACTIONS.START }), []),

    submitTopic: useCallback(
      (topic) => dispatch({ type: ACTIONS.SUBMIT_TOPIC, payload: topic }),
      [],
    ),

    advanceFraming: useCallback(
      () => dispatch({ type: ACTIONS.ADVANCE_FRAMING }),
      [],
    ),

    setChallenge: useCallback(
      (challenge) => dispatch({ type: ACTIONS.SET_CHALLENGE, payload: challenge }),
      [],
    ),

    setChallengeError: useCallback(
      (message, fallback) =>
        dispatch({
          type: ACTIONS.SET_CHALLENGE_ERROR,
          payload: { message, fallback },
        }),
      [],
    ),

    beginAttempt: useCallback(
      () => dispatch({ type: ACTIONS.BEGIN_ATTEMPT }),
      [],
    ),

    updateAttempt: useCallback(
      (text) => dispatch({ type: ACTIONS.UPDATE_ATTEMPT, payload: text }),
      [],
    ),

    submitAttempt: useCallback(
      () => dispatch({ type: ACTIONS.SUBMIT_ATTEMPT }),
      [],
    ),

    setFeedback: useCallback(
      (feedback) => dispatch({ type: ACTIONS.SET_FEEDBACK, payload: feedback }),
      [],
    ),

    setFeedbackError: useCallback(
      (message) => dispatch({ type: ACTIONS.SET_FEEDBACK_ERROR, payload: message }),
      [],
    ),

    tryAgain: useCallback(() => dispatch({ type: ACTIONS.TRY_AGAIN }), []),

    saveArtifact: useCallback(
      () => dispatch({ type: ACTIONS.SAVE_ARTIFACT }),
      [],
    ),

    setArtifactSaved: useCallback(
      (artifact) =>
        dispatch({ type: ACTIONS.SET_ARTIFACT_SAVED, payload: artifact }),
      [],
    ),

    newChallenge: useCallback(
      () => dispatch({ type: ACTIONS.NEW_CHALLENGE }),
      [],
    ),

    viewHistory: useCallback(
      () => dispatch({ type: ACTIONS.VIEW_HISTORY }),
      [],
    ),

    goHome: useCallback(() => dispatch({ type: ACTIONS.GO_HOME }), []),
  };

  return { state, actions };
}
