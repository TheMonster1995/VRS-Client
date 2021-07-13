import {
  GET_PARTS,
  UPDATE_PARTS
} from '../actions/types';

const INITIAL_STATE = {parts: []}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PARTS:
      return {
        ...state,
        parts: action.payload
      }

    case UPDATE_PARTS:
      return {
        ...state,
        parts: [...state.parts, action.payload]
      }

    default:
      return state;
  }
}
