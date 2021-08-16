import {
  GET_PARTS,
  GET_ORDERS,
  NEW_ORDER,
  UPDATE_ORDER,
  DELETE_ORDER,
  SIGN_IN,
  SIGN_OUT,
  GET_USERS,
  NEW_USER,
  UPDATE_USER,
  DELETE_USER,
} from './types';
import repairShopApi from '../apis/repairShopApi';

export const loginAction = (token, role, username) => {
  localStorage.setItem('accessToken', token);
  return {
    type: SIGN_IN,
    payload: {
      token,
      role,
      username
    }
  }
}

export const logoutAction = () => {
  localStorage.removeItem('accessToken');
  return {
    type: SIGN_OUT
  }
}

export const checkSignIn = () => async (dispatch, getState) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) return dispatch({
    type: SIGN_OUT
  });

  let tokenCheck;

  try {
    tokenCheck = await repairShopApi.get(
      '/auth',
      {
        headers: {
          accesstoken: accessToken
        }
      }
    )
  } catch (e) {
    localStorage.removeItem('accessToken');
    return dispatch({
      type: SIGN_OUT
    });
  }

  return dispatch({
    type: SIGN_IN,
    payload: {
      token: accessToken,
      role: tokenCheck.data.payload.role,
      username: tokenCheck.data.payload.username
    }
  });
}

export const getOrders = () => async (dispatch, getState) => {
  const response = await repairShopApi.get('/orders', { headers: { accessToken: localStorage.getItem('accessToken') } });
  // const response = {data: [
  //   {
  //       "received_date_time": "2021-08-06T19:30:00.000Z",
  //       "customer_info": {
  //           "name": "فواد سلمانیان",
  //           "address": "خیابان فردوسی، فرعی ۲۰ غربی، پلاک ۳۵",
  //           "phone": "09361446386",
  //           "second_auth": {
  //               "name": "فواد سلمانیان",
  //               "phone": "09361446386"
  //           }
  //       },
  //       "car_info": {
  //           "year": "1",
  //           "make": "1",
  //           "vin": "1",
  //           "license": "1",
  //           "odometer": "1",
  //           "motor": "1"
  //       },
  //       "promised_date_time": "2021-08-06T19:30:00.000Z",
  //       "parts": [
  //           {
  //               "qty": "1",
  //               "num": "1",
  //               "name": "1",
  //               "price": "1",
  //               "warranty": false
  //           },
  //           {
  //               "qty": "2",
  //               "num": "2",
  //               "name": "2",
  //               "price": "2",
  //               "warranty": true
  //           }
  //       ],
  //       "labore": [
  //           {
  //               "qty": "0",
  //               "num": "",
  //               "name": "1",
  //               "price": "22",
  //               "warranty": false
  //           },
  //           {
  //               "qty": "0",
  //               "num": "",
  //               "name": "2",
  //               "price": "333",
  //               "warranty": false
  //           }
  //       ],
  //       "gas_oil_greece": "1",
  //       "misc_merch": "2",
  //       "sublet_repairs": "3",
  //       "storage_fee": "4",
  //       "tax": 30.71,
  //       "labore_only": 355,
  //       "parts_fee": 5,
  //       "cancel_fee": "33",
  //       "written_estimate_choice": "limited",
  //       "written_estimate_limit": "1",
  //       "cost_profit_representation": true,
  //       "law_charge_fee": "22",
  //       "state": "california",
  //       "total": 400.71,
  //       "law_charge": true,
  //       "order_id": "123321432",
  //       "submission_date": '8/7/2021',
  //       "authorized_by": 'Admin dude',
  //       "order_num": '7820211'
  //   }
  // ]};

  dispatch({
    type: GET_ORDERS,
    payload: response.data.payload
  })

  // history.push('/');
}

export const saveOrder = (data, t) => async (dispatch, getState) => {
  let payload = {
    order_num: data.order_num,
    parts: [],
    labore: [],
    customer_info: {
      name: data.customer_name,
      address: data.customer_address,
      phone: data.customer_phone,
      second_auth: {
        name: data.second_auth_name || '',
        phone: data.second_auth_phone || ''
      }
    },
    car_info: {
      year: data.car_year || '',
      make: data.car_make || '',
      vin: data.car_vin || '',
      license: data.car_license || '',
      odometer: data.car_odometer || '',
      motor: data.car_motor || ''
    },
    received_date_time: data.received_date_time,
    promised_date_time: data.promised_date_time,
    gas_oil_grease: data.gas_oil_grease || '0',
    misc_merch: data.misc_merch || '0',
    sublet_repairs: data.sublet_repairs || '0',
    storage_fee: data.storage_fee || '0',
    labore_only: data.total_labore || '0',
    parts_fee: data.total_parts || '0',
    tax: data.total_tax || '0',
    total_fee: data.total || '0',
    cancel_fee: data.cancel_fee || '0',
    written_estimate_choice: data.written_estimate_choice || 'none',
    written_estimate_limit: data.written_estimate_limit || 0,
    cost_profit_representation: data.cost_profit_representation || false,
    law_charge_fee: data.law_charge_fee || '123',
    law_charge: data.law_charge || false,
    state: data.state,
    authorized_by: data.authorized_by,
    submission_date: data.submission_date
  }

  if (data.labore && data.labore.length > 0) payload.labore = data.labore.map(lbr => ({
    qty: lbr.qty || '0',
    num: lbr.num || '',
    name: lbr.name || '',
    price: lbr.price || '0',
    warranty: lbr.warranty || false
  }))

  if (data.parts && data.parts.length > 0) payload.parts = data.parts.map(part => ({
    qty: part.qty || '0',
    num: part.num || '',
    name: part.name || '',
    price: part.price || '0',
    warranty: part.warranty || false
  }))

  let response;

  if (t === 'new') {
    response = await repairShopApi.post(
      '/order/new',
      {
        order: payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'accesstoken': localStorage.getItem('accessToken')
        }
      }
    );
  } else {
    response = await repairShopApi.put(
      '/order',
      {
        order: payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'accesstoken': localStorage.getItem('accessToken')
        }
      }
    );
  }

  payload.order_id = response.data.payload.orderId;

  if (t === 'new') return dispatch({
    type: NEW_ORDER,
    payload
  })

  dispatch({
    type: UPDATE_ORDER,
    payload
  })
}

export const deleteOrder = id => async (dispatch, getState) => {
  await repairShopApi.delete(
    '/order',
    {
      headers: {
        'Content-Type': 'application/json',
        'accesstoken': localStorage.getItem('accessToken')
      },
      data: {
        orderid: id
      }
    }
  );
  // const response = true;

  dispatch({
    type: DELETE_ORDER,
    payload: id
  })
}

export const getUsers = () => async (dispatch, getState) => {
  const response = await repairShopApi.get('/users', { headers: { accessToken: localStorage.getItem('accessToken') } });
  // const response = {data: [
  //   {
  //     user_id: '123',
  //     name: 'some Name',
  //     email: 'email@email.email',
  //     role: 'user',
  //     status: 'inactive',
  //     username: 'someusername'
  //   },
  //   {
  //     user_id: '1231',
  //     name: 'some Name2',
  //     email: 'email2@email.email',
  //     role: 'admin',
  //     status: 'active',
  //     username: 'someusername2'
  //   }
  // ]};

  dispatch({
    type: GET_USERS,
    payload: response.data.payload
  })
}

export const saveUser = (data, t) => async (dispatch, getState) => {
  let payload = {
    name: data.name,
    email: data.email,
    role: data.role || 'admin',
    status: data.status || 'active',
    username: data.username
  }

  let response;

  if (t === 'new') {
    response = await repairShopApi.post(
      '/user/new',
      {
        user: payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'accesstoken': localStorage.getItem('accessToken')
        }
      }
    );
  } else {
    response = await repairShopApi.put(
      '/user',
      {
        userid: data.user_id,
        userdata: payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'accesstoken': localStorage.getItem('accessToken')
        }
      }
    );
  }

  payload.user_id = response.data.payload.userId;

  if (t === 'new') return dispatch({
    type: NEW_USER,
    payload
  })

  dispatch({
    type: UPDATE_USER,
    payload
  })
}

export const deleteUser = id => async (dispatch, getState) => {
  await repairShopApi.delete(
    '/user',
    {
      headers: {
        'Content-Type': 'application/json',
        'accesstoken': localStorage.getItem('accessToken')
      },
      data: {
        userid: id
      }
    }
  );
  // const response = true;

  dispatch({
    type: DELETE_USER,
    payload: id
  })
}

export const getParts = () => async (dispatch, getState) => {
  // const response = await repairShopApi.get('/parts');
  const response = {data: [null]};

  dispatch({
    type: GET_PARTS,
    payload: response.data
  })

  // history.push('/');
}
