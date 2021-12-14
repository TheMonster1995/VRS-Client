import {
  GET_USERS,
  NEW_USER,
  UPDATE_USER,
  DELETE_USER
} from '../actions/types';

const INITIAL_STATE = {users: [], userCount: 0, getCalled: false}

export default (state = INITIAL_STATE, action) => {
  let newUsers;
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        userCount: action.payload.length || 0,
        getCalled: true
      }

    case NEW_USER:
      return {
        ...state,
        users: [action.payload, ...state.users],
        userCount: state.userCount + 1
      }

    case UPDATE_USER:
      newUsers = [...state.users];
      let userIndex = newUsers.findIndex(user => user.user_id === action.payload.user_id)

      newUsers[userIndex] = action.payload;

      return {
        ...state,
        users: newUsers
      }

    case DELETE_USER:
      let users = [...state.users];
      newUsers = users.filter(user => user.user_id !== action.payload);

      return {
        ...state,
        users: newUsers
      }

    default:
      return {...state};
  }
}
