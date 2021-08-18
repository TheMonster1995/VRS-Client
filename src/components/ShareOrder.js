import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ScaleLoader } from 'react-spinners';

import Order from './Order';
import './css-general.css';
import repairShopApi from '../apis/repairShopApi'

import { saveOrder, deleteOrder } from '../actions';

const ShareOrder = props => {
  const [order, setOrder] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getOrder () {
      let fidnOrder;

      try {
        fidnOrder = await repairShopApi.get(`/order/${props.match.params.id}`);
      } catch (e) {
        setLoading(false);
        setOrder('error');
        return;
      }

      setOrder(fidnOrder.data.payload);
      setLoading(false);
    }

    getOrder();
  }, [])

  if (loading) return (
    <section className='w-100 text-center pt-5'>
      <ScaleLoader loading={loading} color='#4b93ff' height={35} width={4} radius={2} margin={2} />
    </section>
  );

  if (order === 'error') return (
    <section className='w-100 text-center pt-5'>
      <h3>404 - Not found</h3>
    </section>
  );

  return(
    <section className='share-order-main container w-xxl-50'>
      <Order data={order} share={true} />
    </section>
  );
}

export default ShareOrder;
