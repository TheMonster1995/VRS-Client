import React, { Component } from 'react';
// import { connect } from 'react-redux';
import Orders from './Orders';

class Landing extends Component {

  render() {
    // if (!this.props.orders) return <div>Loading...</div>;

    // const { id } = this.props.orders.orders;

    return(
      <>
        <Orders />
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
