// Define the initial state
const initialState = {
  sources: [],
};

// Define action types
const ADD_SOURCE = 'ADD_SOURCE';
const REMOVE_SOURCE = 'REMOVE_SOURCE';

// Define the reducer function
const sourceListReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SOURCE:
      return {
        ...state,
        sources: [...state.sources, action.payload],
      };

    case REMOVE_SOURCE:
      return {
        ...state,
        sources: state.sources.filter(source => source.id !== action.payload),
      };

    default:
      return state;
  }
};

// Define action creators
export const addSource = (newSource) => ({
  type: ADD_SOURCE,
  payload: newSource,
});

export const removeSource = (sourceId) => ({
  type: REMOVE_SOURCE,
  payload: sourceId,
});

export default sourceListReducer;
