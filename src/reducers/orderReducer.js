import {
  GET_ORDERS,
  NEW_ORDER,
  UPDATE_ORDER,
  DELETE_ORDER
} from '../actions/types';

const INITIAL_STATE = {orders: []}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ORDERS:
      return {
        ...state,
        orders: action.payload
      }

    case NEW_ORDER:
      return {
        ...state,
        orders: [...state.orders, action.payload]
      }

    default:
      return state;
  }
}
