import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import authReducer from './authReducer';
import orderReducer from './orderReducer';
import partReducer from './partReducer';
import userReducer from './userReducer';

export default combineReducers({
  orders: orderReducer,
  parts: partReducer,
  auth: authReducer,
  form: formReducer,
  users: userReducer
})
