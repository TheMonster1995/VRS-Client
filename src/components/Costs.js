import react, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm, reset, initialize, formValueSelector } from 'redux-form';
import * as _ from 'lodash';
import { BeatLoader } from 'react-spinners';
import DatePicker from "react-datepicker";

import {
  checkSignIn,
  getCosts,
  saveCosts,
  deleteCosts
} from '../actions';

import {
  generatePassword,
  encrypt,
  numberNormalizer
} from '../helper';

class Costs extends Component {
  state = {
    costs: [],
    edit: false,
    costsInEdit: null,
    delete: false,
    costsInDelete: null,
    new: false
  }

  componentDidMount() {
    if (
      this.props.isSignedIn &&
      !this.props.getCalled
    ) return this.props.getCosts();

    if (
      this.props.isSignedIn &&
      this.props.costs
    ) this.addCostsToState()
  }

  componentDidUpdate() {
    if (
      this.props.isSignedIn &&
      !this.props.getCalled
    ) return this.props.getCosts();

    return this.addCostsToState();
  }

  renderError = ({ error, touched }) => (touched && error) && <small className="form-text text-danger d-block">{error}</small>;

  renderInput = ({ input, label, meta, parentClass, inputClass, type }) => {
    return (
      <div className={`d-inline-block ${parentClass}`}>
        <input {...input} className={`form-control border-0 rounded-0 border-bottom ${inputClass}`} placeholder={label} type={type || 'text'} min={0}/>
        {this.renderError(meta)}
      </div>
    );
  }

  renderDatePicker = ({ input, label, meta, parentClass, inputClass, minDate }) => {
    return (
      <div className={`d-inline-block ${parentClass}`}>
        <DatePicker
          dateFormat="MMM yyyy"
          selected={input.value || null}
          onChange={input.onChange}
          minDate={minDate}
          placeholderText={label}
          className='form-control border-0 border-bottom rounded-0'
          showMonthYearPicker={true}
        />
        {this.renderError(meta)}
      </div>
    )
  }

  renderItemsTable = ({fields, meta, section}) => {

    if (fields.length < 2) fields.push();

    if (fields.length > 1 && fields.get(fields.length - 1)) fields.push();

    return fields.map((cost, i) => (
      <tbody key={i}>
        <tr>
          <th scope="row">{i + 1}</th>
          <td>
            <Field
              name={`${cost}.name`}
              component={this.renderInput}
              label={'Description'}
            />
          </td>
          <td>
            <Field
              name={`${cost}.qty`}
              component={this.renderInput}
              label={'QTY.'}
              normalize={value => numberNormalizer(value)}
            />
          </td>
          <td>
            <Field
              name={`${cost}.price`}
              component={this.renderInput}
              label={'Price'}
              normalize={value => numberNormalizer(value)}
            />
          </td>
        </tr>
        {this.renderError(meta)}
      </tbody>
    ))
  }

  capitalize = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

  renderSelect = ({ input, options, disabled = false }) => {
    return (
      <select {...input} className="form-select" disabled={disabled}>
        {options.map((option, i) => <option value={option} key={i}>{this.capitalize(option)}</option>)}
      </select>
    )
  }

  addCostsToState = () => {
    if (this.state.edit || this.state.new || this.state.delete) return;
    let costs = this.props.costs;

    costs = costs.map(cost => ({...cost, edit: false}));

    if (_.isEqual(costs, this.state.costs)) return;

    this.setState({costs});
  }

  toggleEdit = costsId => {
    let newCosts = [...this.state.costs];
    let costsIndex = this.state.costs.findIndex(cost => cost.costs_id === costsId)

    newCosts[costsIndex]['edit'] = true;

    let formInit = this.state.costs[costsIndex];

    formInit.from = new Date(formInit.from).getTime();
    formInit.to = new Date(formInit.to).getTime();

    this.props.initialize('costsForm', formInit)

    this.setState({
      costs: newCosts,
      edit: true,
      costsInEdit: costsId
    })

  }

  toggleNew = () => {
    this.setState({new: true});
    this.props.initialize('costsForm', {})
  };

  onSubmit = formValues => {
    let type = 'new';

    if (this.state.edit && this.state.costsInEdit) type = 'update';

    let costs = formValues.costs.filter(item => {
      let res = false;
      if (
        item &&
        item.name &&
        item.name.toString().trim() !== ''
      ) res = true;

      if (res) return item;
    });

    let total = 0;

    costs.forEach(cost => {
      let priceTemp = cost.price?.replace(/,/g, '');
      if (priceTemp && priceTemp !== '' && !isNaN(priceTemp)) total = total + parseFloat(priceTemp);
    });

    let values = {
      ...formValues,
      costs_id: this.state.costsInEdit,
      costs,
      total
    };

    this.props.saveCosts(values, type);
    this.props.reset('costsForm');
    this.setState({
      edit: false,
      new: false,
      costsInEdit: false
    })
  }

  onCancel = () => {
    let newCosts = [...this.state.costs];
    let costsIndex = this.state.costs.findIndex(cost => cost.costs_id === this.state.costsInEdit)

    newCosts[costsIndex]['edit'] = false;
    console.log('edit onCancel called');
    this.props.reset('costsForm');
    this.setState({
      costs: newCosts,
      edit: false,
      costsInEdit: null
    })
  }

  onNewCancel = () => {
    this.props.reset('costsForm');
    this.setState({
      new: false
    })
  }

  renderDeletePopup = () => {
    return (
      <div className='position-absolute delete-popup-parent'>
        <div className='p-3 bg-white rounded text-center w-50 mx-auto my-5 delete-popup'>
          <p>Are you sure you want to delete this record?</p>
          <button className='btn btn-secondary mx-3' onClick={this.toggleDelete}>Cancel</button>
          <button className='btn btn-outline-danger mx-3' onClick={this.deleteCosts}>Delete</button>
        </div>
      </div>
    )
  }

  toggleDelete = (costsId = null) => this.setState({delete: !this.state.delete, costsInDelete: costsId});

  deleteCosts = () => {
    let costsId = this.state.costsInDelete;
    let newCosts = this.state.costs.filter(cost => cost.costs_id !== costsId);

    this.setState({
      delete: false,
      costsInDelete: null,
      costs: newCosts
    })
    this.props.deleteCosts(costsId);
  }

  generateCostsRows = (costs) => costs.map((row, i) => (
    <tr key={i}>
      <td>{i + 1}</td>
      <td>{row.name}</td>
      <td>{numberNormalizer(row.qty)}</td>
      <td>{numberNormalizer(row.price)}</td>
    </tr>
  ))

  generateNewRow = () => {
    return (
      <tr key={999999}>
        <td className='w-5'>
          <Field
            name='user_id'
            component={this.renderInput}
            onChange={e => e.preventDefault()}
            inputClass="px-0"
          />
        </td>
        <td className='w-17'>
          <Field
            name='name'
            component={this.renderInput}
            label='John Doe'
          />
        </td>
        <td className='w-17'>
          <Field
            name='email'
            component={this.renderInput}
            label='JohnDoe@gmail.com'
            validate={this.emailCheck}
          />
        </td>
        <td className='w-17'>
          <Field
            name='username'
            component={this.renderInput}
            label='JohnDoe95'
            validate={this.usernameCheck}
          />
        </td>
        <td className='w-17'>
          <Field
            name='role'
            component={this.renderSelect}
            options={['admin', 'user']}
          />
        </td>
        <td className='w-17'>
          <Field
            name='status'
            component={this.renderSelect}
            options={['active', 'inactive']}
          />
        </td>
        <td className='w-17'>
          <Field
            name='password'
            component={this.renderInput}
            label='Password'
          />
        </td>
        <td className='w-17'>
          <button className='btn text-success fs-4 p-0 mx-2' type='submit'><i className='bi bi-check-circle'></i></button>
          <button className='btn text-danger fs-4 p-0 mx-2' onClick={this.onNewCancel} type="button"><i className='bi bi-x-circle'></i></button>
        </td>
      </tr>
    )
  }

  generateCostsCards = () => {
    let costs = [...this.state.costs];

    if (this.state.new) costs.unshift('new');

    return costs.map((cost, i) => {
      if (cost === 'new') {
        return (
          <div className='card my-4' key={i}>
            <div className='card-header d-flex justify-content-between'>
              <div className='d-flex'>
                <Field
                  name="from"
                  component={this.renderDatePicker}
                  label="From"
                  parentClass='ms-2'
                />
                <span className='mx-3 mt-2'>-</span>
                <Field
                  name="to"
                  component={this.renderDatePicker}
                  label="To"
                  parentClass='ms-2'
                  minDate={this.props.fromDate}
                />
              </div>
              <div>
                <button className='btn text-danger fs-5 p-0 mx-2' type="button" onClick={this.onNewCancel}><i className='bi bi-x-circle'></i></button>
                <button className='btn text-success fs-5 p-0 mx-2' type="submit"><i className='bi bi-check-circle'></i></button>
              </div>
            </div>
            <div className='card-body'>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Description</th>
                    <th scope="col">QTY.</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <FieldArray name='costs' component={this.renderItemsTable} />
              </table>
            </div>
          </div>
        )
      }

      if (cost.edit) {
        return (
          <div className='card my-4' key={i}>
            <div className='card-header d-flex justify-content-between'>
              <div className='d-flex'>
                <Field
                  name="from"
                  component={this.renderDatePicker}
                  label="From"
                  parentClass='ms-2'
                />
                <span className='mx-3 mt-2'>-</span>
                <Field
                  name="to"
                  component={this.renderDatePicker}
                  label="To"
                  parentClass='ms-2'
                  minDate={this.props.fromDate}
                />
              </div>
              <div>
                <button className='btn text-danger fs-5 p-0 mx-2' type="button" onClick={this.onCancel}><i className='bi bi-x-circle'></i></button>
                <button className='btn text-success fs-5 p-0 mx-2' type="submit"><i className='bi bi-check-circle'></i></button>
              </div>
            </div>
            <div className='card-body'>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Description</th>
                    <th scope="col">QTY.</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <FieldArray name='costs' component={this.renderItemsTable} />
              </table>
            </div>
          </div>
        )
      }

      let fromDate = new Date(cost.from).toDateString();
      let toDate = new Date(cost.to).toDateString();
      return (
        <div className='card my-4' key={i}>
          <div className='card-header justify-content-between d-flex'>
            <div>
              {`${fromDate.slice(4, 7)} ${fromDate.slice(-4)}`} - {`${toDate.slice(4, 7)} ${toDate.slice(-4)}`}
            </div>
            <div>
              <button className='btn text-success fs-5 p-0 mx-2' onClick={this.toggleEdit.bind(this, cost.costs_id)} disabled={this.state.edit} type="button"><i className='bi bi-pencil-square'></i></button>
              <button className='btn text-danger fs-5 p-0 mx-2' type="button" onClick={this.toggleDelete.bind(this, cost.costs_id)} disabled={this.state.edit}><i className='bi bi-trash'></i></button>
            </div>
          </div>
          <div className='card-body'>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Description</th>
                  <th scope="col">QTY.</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                {this.generateCostsRows(cost.costs)}
                <tr style={{borderTop: '1.1px solid black'}}>
                  <td></td>
                  <td></td>
                  <td className='text-end fw-bold'>Total</td>
                  <td>{numberNormalizer(cost.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    })
  }

  renderContent = () => {
    if (!this.props.getCalled) return (<div className='text-center'> <BeatLoader loading={true} color='#4b93ff' size={12} /> </div>);

    if (this.state.costs.length === 0 && !this.state.new) return (
      <div className='text-center'>
        <h5 className='text-muted'>No records have been submitted</h5>
        <button className='btn btn-link' onClick={this.toggleNew}>+ Submit new record</button>
      </div>
    )

    return (
      <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
        {this.generateCostsCards()}
      </form>
    )
  }

  render() {
    return (
      <>
        <div className='add-bar position-relative'>
          {!this.state.new && <button className='btn btn-outline-secondary rounded-circle fs-2 l-40 p-2' onClick={this.toggleNew}><i className='bi bi-plus'></i></button>}
        </div>
        <div className='container users-main position-relative'>
          <h4>Monthly costs</h4>
          {this.renderContent()}
          {this.state.delete && this.renderDeletePopup()}
        </div>
      </>
    )
  }
}

const selector = formValueSelector('costsForm');

const mapStateToProps = (state, ownProps) => {
  return {
    costs: state.costs.costs,
    getCalled: state.costs.getCalled,
    isSignedIn: state.auth.isSignedIn,
    fromDate: selector(state, 'from') || '',
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.from) errors.from = "Please specify start date";

  if (!formValues.to) errors.to = "Please specify end date";

  return errors;
}

export default reduxForm({
  form: 'costsForm',
  validate
})(connect(
  mapStateToProps,
  {
    getCosts,
    saveCosts,
    deleteCosts,
    checkSignIn,
    reset,
    initialize
  }
)(Costs));

// {this.state.new && this.generateNewRow()}
//
//
//
// <td>
//   {(this.props.userRole === 'admin' || this.props.username === row.username) &&
//     <>

//     </>
//   }
// </td>
