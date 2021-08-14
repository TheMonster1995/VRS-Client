import React, { Component } from 'react';
import { connect } from 'react-redux';
import Order from './Order';
import OrderForm from './OrderForm';

import { saveOrder } from '../actions';

class Orders extends Component {
  generateOrders = () => this.props.orders.map(order => <Order data={order} key={order.order_id} />)

  submitForm = data => this.props.saveOrder(data, 'new');

  render() {
    if (!this.props.orders) return <div>Loading...</div>;

    return(
      <section className='orders-main container w-xxl-50'>
        {this.props.new && <OrderForm toggle={this.props.newToggle} onFormSubmit={this.submitForm} />}
        {this.generateOrders()}
        {this.props.orders.length === 0 && <div className='text-center pt-4 fs-4'>No orders found</div>}
      </section>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    orders: state.orders.orders
  };
}

export default connect(mapStateToProps, {saveOrder})(Orders);
