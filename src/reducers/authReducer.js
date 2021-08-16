import { SIGN_IN, SIGN_OUT } from '../actions/types';

const INITIAL_STATE = {
  isSignedIn: null,
  authToken: null,
  role: null,
  username: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        isSignedIn: true,
        authToken: action.payload.token,
        role: action.payload.role,
        username: action.payload.username
      }

    case SIGN_OUT:
      return {
        ...state,
        isSignedIn: false,
        authToken: null,
        role: null,
        username: null
      }

    default:
      return {...state};
  }
}
