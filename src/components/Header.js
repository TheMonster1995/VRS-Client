import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  getOrders,
  logoutAction,
  checkSignIn
} from '../actions';
import './header.css';

class Header extends Component {
  state = {
    results: [],
    showResultContainer: false
  }

  componentDidMount() {
    console.log('componentDidMount');
    if (this.props.isSignedIn && this.props.location.pathname === '/login') return this.props.history.push('/');

    if (this.props.isSignedIn === false && this.props.location.pathname !== '/login') return this.props.history.push('/login');

    if (this.props.isSignedIn === null) return this.props.checkSignIn();

    if (!this.props.isSignedIn) return;

    if (!this.props.orders || this.props.orders.length === 0) this.props.getOrders();
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    if (this.props.isSignedIn && this.props.location.pathname === '/login') return this.props.history.push('/');

    if (this.props.isSignedIn === false && this.props.location.pathname !== '/login') return this.props.history.push('/login');

    if (this.props.isSignedIn === null) return this.props.checkSignIn();

    if (!this.props.getCalled && this.props.isSignedIn) return this.props.getOrders();
  }

  renderInput = ({ input, placeholder }) => {
    return (
      <div className="form-group">
        <input {...input} className="form-control" placeholder={placeholder} />
      </div>
    );
  }

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  }

  onChange = data => {
    if (data.target.value.trim() === '') return this.setState({ showResultContainer: false, results: [] });

    this.search(data.target.value);
    return this.setState({ showResultContainer: true });
  }

  search = phrase => {
    if (!this.props.orders || this.props.orders.length === 0) return this.setState({results: []});

    let searchPhrase = phrase.trim();
    let results = [];

    if (searchPhrase[0] === '#') searchPhrase = searchPhrase.slice(1);

    if (!isNaN(searchPhrase)) {
      this.props.orders.forEach(order => {
        if (order.order_num.toString().includes(searchPhrase)) results.push(order);
      });
    } else {
      this.props.orders.forEach(order => {
        if (order.customer_info.name.toLowerCase().includes(searchPhrase.toLowerCase())) results.push(order)
      });
    }

    return this.setState({
      results
    });
  }

  generateResultsDiv = () => {
    if (!this.state.showResultContainer) return;

    return (
      <div className='results-parent w-100 position-absolute bg-light rounded'>
        {this.generateResults()}
      </div>
    )
  }

  generateResults = () => {
    if (this.state.results.length === 0) {
      return (
        <div className='card m-1'>
          <div className='card-body text-muted'>
            No results found!
          </div>
        </div>
      )
    }

    return this.state.results.map(result => {
      let receivedDate = new Date(result.received_date_time);
      receivedDate = receivedDate.toDateString().slice(4);
      return (
        <Link to={`/order/${result.id}`} key={result.id} className='no-style-link'>
          <div className='card m-1'>
            <div className='card-body'>
              {result.customer_info.name} <span className='text-black-50 fw-bold'>#{result.order_num}</span>
              <div>
                <span className='text-muted'>Received {receivedDate}</span>
              </div>
            </div>
          </div>
        </Link>
      )
    })
  }

  onBlur = () => this.setState({showResultContainer: false});

  onFocus = () => {
    if (this.state.results.length > 0) this.setState({
      showResultContainer: true
    })
  }

  signOut = () => this.props.logoutAction();

  renderHeaderContent = () => (
    <>
      <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0 position-relative w-25">
        <form onSubmit={this.props.handleSubmit(this.onSubmit)} className='w-100' autoComplete="off">
          <Field
            name="searchPhrase"
            component={this.renderInput}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            placeholder="Search..."
          />
        </form>
        {this.generateResultsDiv()}
      </ul>

      <div className="col-md-3 text-end">
        <Link className="btn btn-outline-primary btn-sm" to="/dashboard">Dashboard</Link>
      </div>
    </>
  )

  render() {
    return (
      <header className="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
        <div className='d-flex col-md-3 mb-2 mb-md-0'>
          <a href="/" className={`d-flex align-items-center text-dark text-decoration-none ${this.props.isSignedIn && 'd-sm-block d-none'}`}>
            LOGO
          </a>
          {this.props.isSignedIn && <button className="btn btn-sm text-primary ms-sm-3" onClick={this.signOut}>Sign out</button>}
        </div>

        {this.props.isSignedIn && this.renderHeaderContent()}
      </header>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    orders: state.orders.orders,
    isSignedIn: state.auth.isSignedIn,
    getCalled: state.orders.getCalled
  };
}

export default reduxForm({
  form: 'streamForm'
})(connect(mapStateToProps, {
  getOrders,
  logoutAction,
  checkSignIn
})(withRouter(Header)));
