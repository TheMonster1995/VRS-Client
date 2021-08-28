import React, { Component } from 'react';
import { connect } from 'react-redux';

import { toggleForm } from '../actions';
import Orders from './Orders';
import './css-general.css';

class Landing extends Component {
  toggleForm = () => {
    window.scrollTo(0, 0);
    this.props.toggleForm();
  }

  render() {
    return(
      <>
        <div className='add-bar position-relative'>
          {!this.props.newOrder && <button className='btn btn-outline-secondary rounded-circle fs-2 l-40 p-2' onClick={this.toggleForm}><i className='bi bi-plus'></i></button>}
        </div>
        <Orders new={this.props.newOrder} newToggle={this.props.toggleForm} />
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    newOrder: state.orders.new
  };
}

export default connect(mapStateToProps, { toggleForm })(Landing);
// export default Landing;
