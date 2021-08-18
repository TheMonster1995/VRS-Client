import {
  GET_ORDERS,
  NEW_ORDER,
  UPDATE_ORDER,
  DELETE_ORDER
} from '../actions/types';

const INITIAL_STATE = {orders: [], orderCount: 0, getCalled: false}

export default (state = INITIAL_STATE, action) => {
  let newOrders;
  switch (action.type) {
    case GET_ORDERS:
      return {
        ...state,
        orders: action.payload,
        orderCount: action.payload.length || 0,
        getCalled: true
      }

    case NEW_ORDER:
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        orderCount: state.orderCount + 1
      }

    case UPDATE_ORDER:
      newOrders = [...state.orders];

      let orderIndex = newOrders.findIndex(order => order.order_id === action.payload.order_id)

      newOrders[orderIndex] = action.payload;

      return {
        ...state,
        orders: newOrders
      }

    case DELETE_ORDER:
      let orders = [...state.orders];
      newOrders = orders.filter(order => order.order_id !== action.payload);

      return {
        ...state,
        orders: newOrders
      }

    default:
      return {...state};
  }
}
