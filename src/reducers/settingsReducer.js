import { SET_SETTINGS } from '../actions/types';

const INITIAL_STATE = {
  settings: {},
  shop: {},
  set: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_SETTINGS:
      return {
        ...state,
        settings: action.payload.settings,
        shop: action.payload.shop,
        set: true
      }

    default:
      return {...state};
  }
}
