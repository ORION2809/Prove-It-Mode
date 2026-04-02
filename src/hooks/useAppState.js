import { useReducer, useCallback } from 'react';

export const SCREENS = {
  LANDING: 'LANDING',
  INPUT: 'INPUT',
  FRAMING_BEAT1: 'FRAMING_BEAT1',
  FRAMING_BEAT2: 'FRAMING_BEAT2',
  LOADING_TRAP: 'LOADING_TRAP',
  TRAP: 'TRAP',
  LOADING_MIRROR: 'LOADING_MIRROR',
  MIRROR: 'MIRROR',
};

const ACTIONS = {
  START: 'START',
  SUBMIT_TOPIC: 'SUBMIT_TOPIC',
  ADVANCE_FRAMING: 'ADVANCE_FRAMING',
  SET_TRAP: 'SET_TRAP',
  SET_TRAP_ERROR: 'SET_TRAP_ERROR',
  UPDATE_CONFESSION: 'UPDATE_CONFESSION',
  SUBMIT_CONFESSIONS: 'SUBMIT_CONFESSIONS',
  SET_MIRROR: 'SET_MIRROR',
  SET_MIRROR_ERROR: 'SET_MIRROR_ERROR',
  START_OVER: 'START_OVER',
  GO_HOME: 'GO_HOME',
};

const initialState = {
  screen: SCREENS.LANDING,
  topic: null,
  trap: null,
  confessions: ['', '', ''],
  mirror: null,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.START:
      return { ...state, screen: SCREENS.INPUT, error: null };

    case ACTIONS.SUBMIT_TOPIC:
      return {
        ...initialState,
        screen: SCREENS.FRAMING_BEAT1,
        topic: action.payload.trim(),
      };

    case ACTIONS.ADVANCE_FRAMING:
      if (state.screen === SCREENS.FRAMING_BEAT1) {
        return { ...state, screen: SCREENS.FRAMING_BEAT2 };
      }
      return { ...state, screen: SCREENS.LOADING_TRAP };

    case ACTIONS.SET_TRAP:
      return {
        ...state,
        screen: SCREENS.TRAP,
        trap: action.payload,
        error: null,
      };

    case ACTIONS.SET_TRAP_ERROR:
      return {
        ...state,
        screen: SCREENS.TRAP,
        trap: action.payload.fallback,
        error: action.payload.message,
      };

    case ACTIONS.UPDATE_CONFESSION: {
      const newConfessions = [...state.confessions];
      newConfessions[action.payload.index] = action.payload.text;
      return { ...state, confessions: newConfessions };
    }

    case ACTIONS.SUBMIT_CONFESSIONS:
      return { ...state, screen: SCREENS.LOADING_MIRROR };

    case ACTIONS.SET_MIRROR:
      return {
        ...state,
        screen: SCREENS.MIRROR,
        mirror: action.payload,
        error: null,
      };

    case ACTIONS.SET_MIRROR_ERROR:
      return {
        ...state,
        screen: SCREENS.TRAP,
        error: action.payload,
      };

    case ACTIONS.START_OVER:
      return {
        ...initialState,
        screen: SCREENS.INPUT,
      };

    case ACTIONS.GO_HOME:
      return { ...initialState };

    default:
      return state;
  }
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

    setTrap: useCallback(
      (trap) => dispatch({ type: ACTIONS.SET_TRAP, payload: trap }),
      [],
    ),

    setTrapError: useCallback(
      (message, fallback) =>
        dispatch({
          type: ACTIONS.SET_TRAP_ERROR,
          payload: { message, fallback },
        }),
      [],
    ),

    updateConfession: useCallback(
      (index, text) =>
        dispatch({
          type: ACTIONS.UPDATE_CONFESSION,
          payload: { index, text },
        }),
      [],
    ),

    submitConfessions: useCallback(
      () => dispatch({ type: ACTIONS.SUBMIT_CONFESSIONS }),
      [],
    ),

    setMirror: useCallback(
      (mirror) => dispatch({ type: ACTIONS.SET_MIRROR, payload: mirror }),
      [],
    ),

    setMirrorError: useCallback(
      (message) => dispatch({ type: ACTIONS.SET_MIRROR_ERROR, payload: message }),
      [],
    ),

    startOver: useCallback(
      () => dispatch({ type: ACTIONS.START_OVER }),
      [],
    ),

    goHome: useCallback(() => dispatch({ type: ACTIONS.GO_HOME }), []),
  };

  return { state, actions };
}
