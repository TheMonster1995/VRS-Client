import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';

class Search extends Component {
  state = {
    results: [],
    showResultContainer: false
  }

  wrapperRef = React.createRef();

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = event => {
    if (!this.state.showResultContainer) return;

    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) this.setState({showResultContainer: false})
  }

  renderInput = ({ input, placeholder }) => {
    return (
      <div className="form-group">
        <input {...input} className="form-control" placeholder={placeholder} />
      </div>
    );
  }

  onSubmit = formValues => {
    return;
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
        if (order.order.order_num.toString().includes(searchPhrase)) results.push(order);
      });
    } else {
      this.props.orders.forEach(order => {
        if (order.order.customer_info.name.toLowerCase().includes(searchPhrase.toLowerCase())) results.push(order)
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
      let receivedDate = new Date(result.order.received_date_time);
      receivedDate = receivedDate.toDateString().slice(4);
      return (
        <Link to={`/order/${result.order_id}`} key={result.order_id} className='no-style-link' onClick={() => this.setState({showResultContainer: false})}>
          <div className='card m-1'>
            <div className='card-body'>
              {result.order.customer_info.name} <span className='text-black-50 fw-bold'>#{result.order.order_num}</span>
              <div>
                <span className='text-muted'>Received {receivedDate}</span>
              </div>
            </div>
          </div>
        </Link>
      )
    })
  }

  onFocus = () => {
    if (this.state.results.length > 0) this.setState({
      showResultContainer: true
    })
  }

  render() {
    return (
      <ul className="nav mb-2 justify-content-center mb-md-0 position-relative w-50 w-lg-25" ref={this.wrapperRef}>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)} className='w-100' autoComplete="off">
          <Field
            name="searchPhrase"
            component={this.renderInput}
            onChange={this.onChange}
            onFocus={this.onFocus}
            placeholder="Search..."
          />
        </form>
        {this.generateResultsDiv()}
      </ul>
    )
  }
}

export default reduxForm({
  form: 'searchForm'
})(Search);
