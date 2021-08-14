import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from './Order';
import OrderForm from './OrderForm';
import './css-general.css';

import { saveOrder, deleteOrder } from '../actions';

class ShowOrder extends Component {
  state = {edit: false, delete: false, exists: null}

  componentDidMount () {
    return this.setOrder();
  }

  componentDidUpdate () {
    if (this.state.exists || (!this.state.exists && this.props.orderCount === 0)) return;

    return this.setOrder();
  }

  toggleEdit = () => this.setState({edit: !this.state.edit});

  toggleDelete = () => this.setState({delete: !this.state.delete});

  setOrder = () => {

    if (!this.props.orders) return;
    if (this.props.orderCount === 0) return this.setState({ exists: false });

    let order = this.props.orders.find(order => order.order_id.toString() === this.props.match.params.id.toString());

    if (!order && !this.state.exists) return;

    if (!order) return this.setState({order: {}, exists: false})

    return this.setState({
      exists: true
    })
  }

  submitForm = data => this.props.saveOrder(data, 'update');

  deleteOrder = () => {
    console.log('delete order called');
    this.props.deleteOrder(this.props.match.params.id);
    this.props.history.push('/');
  }

  renderDeletePopup = () => {
    return (
      <div className='position-absolute delete-popup-parent'>
        <div className='p-5 bg-white rounded text-center w-50 mx-auto my-5'>
          <p>Are you sure you want to delete this order?</p>
          <button className='btn btn-secondary mx-3' onClick={this.toggleDelete}>Cancel</button>
          <button className='btn btn-outline-danger mx-3' onClick={this.deleteOrder}>Delete</button>
        </div>
      </div>
    )
  }

  render() {
    if (!this.state.exists) return <div>Loading...</div>;

    if (!this.state.exists) return <div>404 - Not Found</div>

    const order = this.props.orders.find(order => order.order_id.toString() === this.props.match.params.id.toString())

    return(
      <section className='show-order-main container w-xxl-50 position-relative'>
        {!this.state.edit && <Order data={order} actions={true} toggleEdit={this.toggleEdit} toggleDelete={this.toggleDelete} />}
        {this.state.edit && <OrderForm data={order} toggle={this.toggleEdit} onFormSubmit={this.submitForm} />}
        {this.state.delete && this.renderDeletePopup()}
      </section>
    );
  }
}

// <div className='add-bar position-relative'>
//   {!this.state.showForm && <button className='btn btn-outline-secondary rounded-circle fs-3' onClick={this.toggleForm}><i className='bi bi-plus'></i></button>}
// </div>
// {this.state.showForm && <AddForm toggle={this.toggleForm} />}
// <Orders />

const mapStateToProps = (state, ownProps) => {
  return {
    orders: state.orders.orders,
    orderCount: state.orders.orderCount
  };
}

export default connect(mapStateToProps, {saveOrder, deleteOrder})(ShowOrder);
// export default ShowOrder;
