import {
  GET_ORDERS,
  GET_PARTS
} from './types';
import repairShopApi from '../apis/repairShopApi';

// export const normalAction = userId => {
//   return {
//     type: SIGN_IN,
//     payload: userId
//   }
// }

export const getOrders = () => async (dispatch, getState) => {
  // const response = await repairShopApi.get('/orders');
  const response = {data: [
    {
      id: 123,
      order_num: 12356789123,
      received_date_time: new Date(),
      customer_info: {
        name: 'Fred Finch',
        address: 'Somewhere in france',
        phone: '+0012345678',
        second_auth: {
          name: 'Freddy finch',
          phone: '+0098765432'
        }
      },
      car_info: {
        year: '1994',
        make: 'kia',
        vin: '123412345678',
        license: '95m197ir41',
        odometer: '267000',
        motor: '123123321321'
      },
      promised_date_time: new Date(),
      parts: [
        {
          qty: '1',
          num: '123321',
          name: 'part 1',
          price: '123',
          warranty: false
        },
        {
          qty: '1',
          num: '123321',
          name: 'part 2',
          price: '123',
          warranty: false
        },
        {
          qty: '1',
          num: '123321',
          name: 'part 3',
          price: '123',
          warranty: false
        },
      ],
      labore: [
        {
          name: 'electrical work',
          price: '772'
        },
        {
          name: 'replacement',
          price: '500'
        },
      ],
      gas_oil_greece: '0',
      misc_merch: '0',
      subtle_repairs: '0',
      storage_fee: '0',
      tax: '1230',
      labore_only: '1272',
      parts_fee: '123123',
      cance_fee: '323232',
      written_estimate_choice: 'none',
      cost_profit_representation: false,
      law_charge_fee: '123',
      state: 'california',
      total: '987987978',
      authorized_by: 'Admin dude',
      law_charge: true
    },
    {
      id: 1234,
      order_num: 12356789123,
      received_date_time: new Date(),
      customer_info: {
        name: 'Fred Finch',
        address: 'Somewhere in france',
        phone: '+0012345678',
        second_auth: {
          name: 'Freddy finch',
          phone: '+0098765432'
        }
      },
      car_info: {
        year: '1994',
        make: 'kia',
        vin: '123412345678',
        license: '95m197ir41',
        odometer: '267000',
        motor: '123123321321'
      },
      promised_date_time: new Date(),
      parts: [
        {
          qty: '1',
          num: '123321',
          name: 'part 1',
          price: '123',
          warranty: false
        },
        {
          qty: '1',
          num: '123321',
          name: 'part 2',
          price: '123',
          warranty: false
        },
        {
          qty: '1',
          num: '123321',
          name: 'part 3',
          price: '123',
          warranty: false
        },
      ],
      labore: [
        {
          name: 'electrical work',
          price: '772'
        },
        {
          name: 'replacement',
          price: '500'
        },
      ],
      gas_oil_greece: '0',
      misc_merch: '0',
      subtle_repairs: '0',
      storage_fee: '0',
      tax: '1230',
      labore_only: '1272',
      parts_fee: '123123',
      cance_fee: '323232',
      written_estimate_choice: 'none',
      cost_profit_representation: false,
      law_charge_fee: '123',
      state: 'california',
      total: '987987978',
      authorized_by: 'Admin dude',
      law_charge: true
    },
    {
      id: 1235,
      order_num: 12356789123,
      received_date_time: new Date(),
      customer_info: {
        name: 'Fred Finch',
        address: 'Somewhere in france',
        phone: '+0012345678',
        second_auth: {
          name: 'Freddy finch',
          phone: '+0098765432'
        }
      },
      car_info: {
        year: '1994',
        make: 'kia',
        vin: '123412345678',
        license: '95m197ir41',
        odometer: '267000',
        motor: '123123321321'
      },
      promised_date_time: new Date(),
      parts: [
        {
          qty: '1',
          num: '123321',
          name: 'part 1',
          price: '123',
          warranty: false
        },
        {
          qty: '1',
          num: '123321',
          name: 'part 2',
          price: '123',
          warranty: false
        },
        {
          qty: '1',
          num: '123321',
          name: 'part 3',
          price: '123',
          warranty: false
        },
      ],
      labore: [
        {
          name: 'electrical work',
          price: '772'
        },
        {
          name: 'replacement',
          price: '500'
        },
      ],
      gas_oil_greece: '0',
      misc_merch: '0',
      subtle_repairs: '0',
      storage_fee: '0',
      tax: '1230',
      labore_only: '1272',
      parts_fee: '123123',
      cance_fee: '323232',
      written_estimate_choice: 'none',
      cost_profit_representation: false,
      law_charge_fee: '123',
      state: 'california',
      total: '987987978',
      authorized_by: 'Admin dude',
      law_charge: true
    },
    {
      id: 1236,
      order_num: 12356789123,
      received_date_time: new Date(),
      customer_info: {
        name: 'Fred Finch',
        address: 'Somewhere in france',
        phone: '+0012345678',
        second_auth: {
          name: 'Freddy finch',
          phone: '+0098765432'
        }
      },
      car_info: {
        year: '1994',
        make: 'kia',
        vin: '123412345678',
        license: '95m197ir41',
        odometer: '267000',
        motor: '123123321321'
      },
      promised_date_time: new Date(),
      parts: [
        {
          qty: '1',
          num: '123321',
          name: 'part 1',
          price: '123',
          warranty: false
        },
        {
          qty: '1',
          num: '123321',
          name: 'part 2',
          price: '123',
          warranty: false
        },
        {
          qty: '1',
          num: '123321',
          name: 'part 3',
          price: '123',
          warranty: false
        },
      ],
      labore: [
        {
          name: 'electrical work',
          price: '772'
        },
        {
          name: 'replacement',
          price: '500'
        },
      ],
      gas_oil_greece: '0',
      misc_merch: '0',
      subtle_repairs: '0',
      storage_fee: '0',
      tax: '1230',
      labore_only: '1272',
      parts_fee: '123123',
      cance_fee: '323232',
      written_estimate_choice: 'none',
      cost_profit_representation: false,
      law_charge_fee: '123',
      state: 'california',
      total: '987987978',
      authorized_by: 'Admin dude',
      law_charge: true
    },
    {
      id: 1237,
      order_num: 12356789123,
      received_date_time: new Date(),
      customer_info: {
        name: 'Fred Finch',
        address: 'Somewhere in france',
        phone: '+0012345678',
        second_auth: {
          name: 'Freddy finch',
          phone: '+0098765432'
        }
      },
      car_info: {
        year: '1994',
        make: 'kia',
        vin: '123412345678',
        license: '95m197ir41',
        odometer: '267000',
        motor: '123123321321'
      },
      promised_date_time: new Date(),
      parts: [
        {
          qty: '1',
          num: '123321',
          name: 'part 1',
          price: '123',
          warranty: false
        },
        {
          qty: '1',
          num: '123321',
          name: 'part 2',
          price: '123',
          warranty: false
        },
        {
          qty: '1',
          num: '123321',
          name: 'part 3',
          price: '123',
          warranty: false
        },
      ],
      labore: [
        {
          name: 'electrical work',
          price: '772'
        },
        {
          name: 'replacement',
          price: '500'
        },
      ],
      gas_oil_greece: '0',
      misc_merch: '0',
      subtle_repairs: '0',
      storage_fee: '0',
      tax: '1230',
      labore_only: '1272',
      parts_fee: '123123',
      cance_fee: '323232',
      written_estimate_choice: 'none',
      cost_profit_representation: false,
      law_charge_fee: '123',
      state: 'california',
      total: '987987978',
      authorized_by: 'Admin dude',
      law_charge: true
    },
    {
      id: 1238,
      order_num: 12356789123,
      received_date_time: new Date(),
      customer_info: {
        name: 'Fred Finch',
        address: 'Somewhere in france',
        phone: '+0012345678',
        second_auth: {
          name: 'Freddy finch',
          phone: '+0098765432'
        }
      },
      car_info: {
        year: '1994',
        make: 'kia',
        vin: '123412345678',
        license: '95m197ir41',
        odometer: '267000',
        motor: '123123321321'
      },
      promised_date_time: new Date(),
      parts: [
        {
          qty: '1',
          num: '123321',
          name: 'part 1',
          price: '123',
          warranty: false
        },
        {
          qty: '1',
          num: '123321',
          name: 'part 2',
          price: '123',
          warranty: false
        },
        {
          qty: '1',
          num: '123321',
          name: 'part 3',
          price: '123',
          warranty: false
        },
      ],
      labore: [
        {
          name: 'electrical work',
          price: '772'
        },
        {
          name: 'replacement',
          price: '500'
        },
      ],
      gas_oil_greece: '0',
      misc_merch: '0',
      subtle_repairs: '0',
      storage_fee: '0',
      tax: '1230',
      labore_only: '1272',
      parts_fee: '123123',
      cance_fee: '323232',
      written_estimate_choice: 'none',
      cost_profit_representation: false,
      law_charge_fee: '123',
      state: 'california',
      total: '987987978',
      authorized_by: 'Admin dude',
      law_charge: true
    }
  ]};

  dispatch({
    type: GET_ORDERS,
    payload: response.data
  })

  // history.push('/');
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
