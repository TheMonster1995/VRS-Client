import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScaleLoader } from 'react-spinners';

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
    if (!this.props.orders || !this.props.getCalled) return;
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

  renderContent = () => {
    if (this.state.exists === null) return <div className='w-100 text-center'><ScaleLoader loading={true} color='#4b93ff' height={35} width={4} radius={2} margin={2} /></div>;

    if (!this.state.exists) return <div className='w-100 text-center'>404 - Not Found</div>

    const order = this.props.orders.find(order => order.order_id.toString() === this.props.match.params.id.toString())

    return (
      <>
        {!this.state.edit && <Order data={order} actions={true} toggleEdit={this.toggleEdit} toggleDelete={this.toggleDelete} taxLabel={this.props.taxLabel} />}
        {this.state.edit && <OrderForm data={order} toggle={this.toggleEdit} onFormSubmit={this.submitForm} taxLabel={this.props.taxLabel} />}
        {this.state.delete && this.renderDeletePopup()}
      </>
    )
  }

  render() {


    return(
      <section className='show-order-main container position-relative'>
        {this.renderContent()}
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
    orderCount: state.orders.orderCount,
    getCalled: state.orders.getCalled,
    taxLabel: state.settings.settings.tax_label
  };
}

export default connect(mapStateToProps, {saveOrder, deleteOrder})(ShowOrder);
// export default ShowOrder;
