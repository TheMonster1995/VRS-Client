import React, { Component } from 'react';
import { connect } from 'react-redux';
import { someAction } from '../../actions';

class SomeComponent extends Component {
  componentDidMount() {
    this.props.someAction();
  }

  render() {
    if (!this.props.customState) {
      return <div>Loading...</div>;
    }

    const { title, description } = this.props.customState;

    return(
      <div>
        <h3>{title}</h3>
        <h5 className='text-muted'>{description}</h5>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    customState: state.streams[ownProps.match.params.id]
  };
}

export default connect(mapStateToProps, {
  someAction
})(SomeComponent);
