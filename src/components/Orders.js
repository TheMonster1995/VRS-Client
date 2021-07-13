import React, { Component } from 'react';
import { connect } from 'react-redux';
import Order from './Order';

class Orders extends Component {

  generateOrders = () => this.props.orders.map(order => <Order data={order} key={order.id} />)

  render() {
    if (!this.props.orders || this.props.orders.length === 0) return <div>Loading...</div>;

    console.log('here another');
    console.log(this.generateOrders());

    return(
      <section className='orders-main container w-50'>
        {this.generateOrders()}
      </section>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    orders: state.orders.orders
  };
}

export default connect(mapStateToProps, {})(Orders);
