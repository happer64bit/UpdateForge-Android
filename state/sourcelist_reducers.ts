// Define the initial state
const initialState = {
  sources: [],
};

// Define action types
const ADD_SOURCE = 'ADD_SOURCE';
const REMOVE_SOURCE = 'REMOVE_SOURCE';
const EDIT_SOURCE = 'EDIT_SOURCE';
const FIND_SOURCE = 'FIND_SOURCE';

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

    case EDIT_SOURCE:
      return {
        ...state,
        sources: state.sources.map(source => {
          if (source.id === action.payload.id) {
            // Update the matched source
            return { ...source, ...action.payload.updatedSource };
          }
          return source;
        }),
      };

    case FIND_SOURCE:
      const foundSource = state.sources.find(source => source.id === action.payload);
      return {
        ...state,
        foundSource,
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

export const editSource = (sourceId, updatedSource) => ({
  type: EDIT_SOURCE,
  payload: { id: sourceId, updatedSource },
});

export const findSource = (sourceId) => ({
  type: FIND_SOURCE,
  payload: sourceId,
});

export default sourceListReducer;
