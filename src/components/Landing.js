import React, { Component } from 'react';
// import { connect } from 'react-redux';
import Orders from './Orders';
import './css-general.css';

class Landing extends Component {
  state = {showForm: this.props.showForm || false}

  toggleForm = () => this.setState({showForm: !this.state.showForm});

  render() {
    return(
      <>
        <div className='add-bar position-relative'>
          {!this.state.showForm && <button className='btn btn-outline-secondary rounded-circle fs-3 l-40' onClick={this.toggleForm}><i className='bi bi-plus'></i></button>}
        </div>
        <Orders new={this.state.showForm} newToggle={this.toggleForm} />
      </>
    );
  }
}

// const mapStateToProps = (state, ownProps) => {
//   return {
//     orders: state.orders.orders
//   };
// }

// export default connect(mapStateToProps, {})(Landing);
export default Landing;
