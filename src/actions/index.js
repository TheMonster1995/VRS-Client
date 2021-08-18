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
  SET_SETTINGS
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
  const response = {data: [
    {
        order_id: "123321432",
        shopOrder: {parts: [], labore: []},
        order: {"received_date_time": "2021-08-06T19:30:00.000Z",
        "customer_info": {
            "name": "فواد سلمانیان",
            "address": "خیابان فردوسی، فرعی ۲۰ غربی، پلاک ۳۵",
            "phone": "09361446386",
            "second_auth": {
                "name": "فواد سلمانیان",
                "phone": "09361446386"
            }
        },
        "car_info": {
            "year": "1",
            "make": "1",
            "vin": "1",
            "license": "1",
            "odometer": "1",
            "motor": "1"
        },
        "promised_date_time": "2021-08-06T19:30:00.000Z",
        "parts": [
            {
                "qty": "1",
                "num": "1",
                "name": "1",
                "price": "1",
                "price_total": "1",
                "warranty": false
            },
            {
                "qty": "2",
                "num": "2",
                "name": "2",
                "price": "2",
                "price_total": "4",
                "warranty": true
            }
        ],
        "labore": [
            {
                "qty": "0",
                "num": "",
                "name": "1",
                "price": "22",
                "warranty": false
            },
            {
                "qty": "0",
                "num": "",
                "name": "2",
                "price": "333",
                "warranty": false
            }
        ],
        "gas_oil_greece": "1",
        "misc_merch": "2",
        "sublet_repairs": "3",
        "storage_fee": "4",
        "tax": 30.71,
        "labore_only": 355,
        "parts_fee": 5,
        "cancel_fee": "33",
        "written_estimate_choice": "limited",
        "written_estimate_limit": "1",
        "cost_profit_representation": true,
        "law_charge_fee": "22",
        "state": "california",
        "total_fee": 400.71,
        "law_charge": true,
        "order_id": "123321432",
        "submission_date": '8/7/2021',
        "authorized_by": 'Admin dude',
        "order_num": '7820211'}
    }
  ]};

  dispatch({
    type: GET_ORDERS,
    payload: response.data
  })

  // const response = await repairShopApi.get('/orders', { headers: { accesstoken: localStorage.getItem('accessToken') } });
  //
  // dispatch({
  //   type: GET_ORDERS,
  //   payload: response.data.payload
  // })

  // history.push('/');
}

export const saveOrder = (data, t) => async (dispatch, getState) => {
  let order = {
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
    gas_oil_grease: data.gas_oil_grease?.toString().replace(/,/g, '') || '0',
    misc_merch: data.misc_merch?.toString().replace(/,/g, '') || '0',
    sublet_repairs: data.sublet_repairs?.toString().replace(/,/g, '') || '0',
    storage_fee: data.storage_fee?.toString().replace(/,/g, '') || '0',
    labore_only: data.total_labore?.toString().replace(/,/g, '') || '0',
    parts_fee: data.total_parts?.toString().replace(/,/g, '') || '0',
    tax: data.total_tax?.toString().replace(/,/g, '') || '0',
    total_fee: data.total?.toString().replace(/,/g, '') || '0',
    cancel_fee: data.cancel_fee?.toString().replace(/,/g, '') || '0',
    written_estimate_choice: data.written_estimate_choice || 'none',
    written_estimate_limit: data.written_estimate_limit?.toString().replace(/,/g, '') || '0',
    cost_profit_representation: data.cost_profit_representation || false,
    law_charge_fee: data.law_charge_fee?.toString().replace(/,/g, '') || '0',
    law_charge: data.law_charge || false,
    state: data.state,
    authorized_by: data.authorized_by,
    submission_date: data.submission_date
  }

  if (data.labore) order.labore = data.labore.map(lbr => ({
    name: lbr.name || '',
    price: lbr.price?.toString().replace(/,/g, '') || '0'
  }))

  if (data.parts) order.parts = data.parts.map(part => ({
    qty: part.qty?.toString().replace(/,/g, '') || '0',
    num: part.num || '',
    name: part.name || '',
    price: part.price?.toString().replace(/,/g, '') || '0',
    price_total: part.price_total?.toString().replace(/,/g, '') || '0',
    warranty: part.warranty || false
  }))

  let shopOrder = {
    order_num: data.order_num,
    parts: [],
    labore: [],
    gas_oil_grease: data.shop_gas_iol_grease?.toString().replace(/,/g, '') || '0',
  	misc_merch: data.shop_misc_merch?.toString().replace(/,/g, '') || '0',
  	sublet_repairs: data.shop_sublet_repairs?.toString().replace(/,/g, '') || '0',
  	storage_fee: data.shop_storage_fee?.toString().replace(/,/g, '') || '0',
  	labore_only: data.shop_total_labore?.toString().replace(/,/g, '') || '0',
  	parts_fee: data.shop_total_parts?.toString().replace(/,/g, '') || '0',
  	total_fee: data.shop_total?.toString().replace(/,/g, '') || '0'
  }

  if (!data.shop_labore) shopOrder.labore = order.labore.map(lbr => ({...lbr, price: ''}));

  if (data.shop_labore) shopOrder.labore = data.shop_labore.map(lbr => ({
    name: lbr.name || '',
    price: lbr.price?.toString().replace(/,/g, '') || '0'
  }))

  if (data.shop_labore && data.shop_labore.length < order.labore.length) {
    order.labore.forEach(item => {
      let laboreDes = item.name;
      let shopLaboreIndex = data.shop_labore.findIndex(lbr => lbr.name === laboreDes);
      if (shopLaboreIndex === -1) shopOrder.parts.push({...item, price: ''})
    });
  }

  if (!data.shop_parts) shopOrder.parts = order.parts.map(part => ({...part, price: '', price_total: ''}));

  if (data.shop_parts) shopOrder.parts = data.shop_parts.map(part => ({
    qty: part.qty?.toString().replace(/,/g, '') || '0',
    num: part.num || '',
    name: part.name || '',
    price: part.price?.toString().replace(/,/g, '') || '0',
    price_total: part.price_total?.toString().replace(/,/g, '') || '0',
    warranty: part.warranty || false
  }))

  if (data.shop_parts && data.shop_parts.length < order.parts.length) {
    order.parts.forEach(item => {
      let partName = item.name;
      let shopPartIndex = data.shop_parts.findIndex(prt => prt.name === partName);
      if (shopPartIndex === -1) shopOrder.parts.push({...item, price: '', price_total: ''})
    });
  }

  let response;

  if (t === 'new') {
    response = await repairShopApi.post(
      '/order/new',
      {
        order,
        shopOrder
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
        order,
        shopOrder
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'accesstoken': localStorage.getItem('accessToken')
        }
      }
    );
  }

  let payload = {
    order_id: response.data.payload.orderId,
    order,
    shopOrder
  }

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
  const response = await repairShopApi.get('/users', { headers: { accesstoken: localStorage.getItem('accessToken') } });
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
    username: data.username.toLowerCase()
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

export const getSettings = () => async (dispatch, getState) => {
  const response = await repairShopApi.get('/settings', { headers: { accesstoken: localStorage.getItem('accessToken') } })

  dispatch({
    type: SET_SETTINGS,
    payload: {
      settings: {
        tax_rate: response.data.payload.tax_rate,
        state: response.data.payload.state
      },
      shop: {
        shop_name: response.data.payload.shop_name,
        shop_address: response.data.payload.shop_address,
        shop_phone: response.data.payload.shop_phone,
      }
    }
  })
}

export const updateSettings = data => async (dispatch, getState) => {
  await repairShopApi.put('/settings', { data }, { headers: { accesstoken: localStorage.getItem('accessToken') } });

  dispatch({
    type: SET_SETTINGS,
    payload: {
      settings: {
        tax_rate: data.tax_rate,
        state: data.state
      },
      shop: {
        shop_name: data.shop_name,
        shop_address: data.shop_address,
        shop_phone: data.shop_phone,
      }
    }
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
