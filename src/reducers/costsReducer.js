import {
  GET_COSTS,
  NEW_COSTS,
  UPDATE_COSTS,
  DELETE_COSTS
} from '../actions/types';

const INITIAL_STATE = {costs: [], getCalled: false}

export default (state = INITIAL_STATE, action) => {
  let newCosts;
  switch (action.type) {
    case GET_COSTS:
      return {
        ...state,
        costs: [...action.payload],
        getCalled: true
      }

    case NEW_COSTS:
      return {
        ...state,
        costs: [action.payload, ...state.costs]
      }

    case UPDATE_COSTS:
      newCosts = [...state.costs];

      let costsIndex = newCosts.findIndex(cost => cost.costs_id === action.payload.costs_id)

      newCosts[costsIndex] = action.payload;

      return {
        ...state,
        costs: newCosts
      }

    case DELETE_COSTS:
      let costs = [...state.costs];
      newCosts = costs.filter(cost => cost.costs_id !== action.payload);

      return {
        ...state,
        costs: newCosts
      }

    default:
      return {...state};
  }
}
