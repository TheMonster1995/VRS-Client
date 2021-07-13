import { SIGN_IN, SIGN_OUT } from '../actions/types';

const INITIAL_STATE = {
  isSignedIn: null,
  authToken: null,
  role: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        isSignedIn: true,
        authToken: action.payload.token,
        role: action.payload.role
      }

    case SIGN_OUT:
      return {
        ...state,
        isSignedIn: false,
        authToken: null,
        role: null
      }

    default:
      return state;
  }
}
