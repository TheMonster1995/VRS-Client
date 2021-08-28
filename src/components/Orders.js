import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScaleLoader } from 'react-spinners';

import Order from './Order';
import OrderForm from './OrderForm';
import { saveOrder } from '../actions';

class Orders extends Component {
  generateOrders = () => this.props.orders.map(order => <Order data={order} key={order.order_id} type="single" />)

  submitForm = data => this.props.saveOrder(data, 'new');

  renderContent = () => {
    if (!this.props.getCalled) return <div className='text-center pt-5'><ScaleLoader loading={true} color='#84d758' height={35} width={4} radius={2} margin={2} /></div>;

    return (
      <>
        {this.props.new && <OrderForm toggle={this.props.newToggle} onFormSubmit={this.submitForm} />}
        {this.generateOrders()}
        {(this.props.orders.length === 0 && !this.props.new) &&
          <div className='text-center pt-4 fs-4'>
            <div>You haven't submitted any orders</div>
            <button type='button' className='btn btn-link fs-4' onClick={this.props.newToggle}>Submit new order</button>
          </div>
        }
      </>
    )
  }

  render() {
    return(
      <section className='orders-main container'>
        {this.renderContent()}
      </section>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    orders: state.orders.orders,
    getCalled: state.orders.getCalled
  };
}

export default connect(mapStateToProps, {saveOrder})(Orders);
