import react, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm, reset, initialize, change, arrayPush } from 'redux-form';
import { BeatLoader } from 'react-spinners';

import EditPasswordForm from './EditPasswordForm';
import repairShopApi from '../apis/repairShopApi';
import {
  encrypt,
  numberNormalizer
} from '../helper';
import {
  updateSettings
} from '../actions';

class Settings extends Component {
  state = {
    edit: false,
    changePassword: false,
    loading: false,
    error: '',
    phonesNum: null
  }

  renderInput = ({ input, label, meta, parentClass, inputClass, type }) => {
    return (
      <div className={`${parentClass}`}>
        {label !== null && <label className="form-label mt-3">{label}</label>}
        <input {...input} className={`form-control border-0 rounded-0 border-bottom ${inputClass}`} type={type || 'text'}/>
        {this.renderError(meta)}
      </div>
    );
  }

  renderError = ({ error, touched }) => (touched && error) && <small className="form-text text-danger d-block">{error}</small>;

  toggleEdit = () => {
    let formData = {
      tax_label: this.props.tax_label,
      tax_rate: this.props.tax_rate,
      state: this.props.state,
      shop_name: this.props.shop.name,
      shop_phones: this.props.shop.phones,
      shop_address: this.props.shop.address
    }

    this.setState({edit: true, phonesNum: this.props.shop.phones.length});
    this.props.initialize('settingsForm', formData);
  }

  triggerEditPassword = () => this.setState({changePassword: true});

  changePassword = async ({password}) => {
    this.setState({loading: true, changePassword: false});
    let encPassword = encrypt(password);

    let savePassword;

    try {
      savePassword = await repairShopApi.put(
        '/password',
        {
          newpassword: encPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'accesstoken': localStorage.getItem('accessToken')
          }
        }
      )
    } catch (err) {
      console.log('some error');
      console.log(err);
      return this.setState({error: 'There was a problem saving new password. Try again or contact support', loading: false})
    }

    this.setState({
      loading: false,
      error: ''
    })
  }

  onSubmit = formValues => {
    this.setState({edit: false});
    let values = {...formValues};
    values.shop_phones = values.shop_phones.filter(phone => phone);
    this.props.updateSettings(values);
    this.props.reset('settingsForm');
  }

  onCancel = () => {
    this.setState({edit: false});
    this.props.reset('settingsForm');
  }

  cancelEditPassword = () => this.setState({changePassword: false});

  validatePhone = val => {
    if (!val) return;

    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    if (phoneRegex.test(val)) return;

    return 'Invalid phone number';
  }

  pretifyPhone = val => {
    let cleaned = ('' + val).replace(/\D/g, '');

    //Check if the input is of correct length
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    // if (match) this.props.change('settingsForm', 'shop_phone', `(${match[1]})${match[2]}-${match[3]}`);
    if (match) return `(${match[1]})${match[2]}-${match[3]}`;

    return val;
  }

  renderPhonesInput = ({fields, meta, section}) => {
    return fields.map((phone, i) => (
      <Field
        key={i}
        name={phone}
        component={this.renderInput}
        label={`Shop phone ${i + 1}`}
        validate={this.validatePhone}
        normalize={this.pretifyPhone}
      />
    ))
  }

  renderPhones = () => {
    if (!this.props.shop?.phones) return;

    return this.props.shop.phones.map((phone, i) => (<p className='py-1 ps-4 fw-bold' key={i}>{phone}</p>))
  }

  renderEditForm = () => {
    return (
      <form onSubmit={this.props.handleSubmit(this.onSubmit)} className='row'>
        <div className='col-12 col-md-6'>
          <Field
            name='tax_label'
            component={this.renderInput}
            label={null}
          />
          <Field
            name='tax_rate'
            component={this.renderInput}
            normalize={value => numberNormalizer(value)}
            label={null}
          />
          <Field
            name='state'
            component={this.renderInput}
            label='State'
          />
        </div>
        <div className='col-12 col-md-6'>
          <Field
            name='shop_name'
            component={this.renderInput}
            label='Shop name'
          />
          <FieldArray name='shop_phones' component={this.renderPhonesInput}/>
          <button className='btn btn-link float-end' type="button" onClick={() => this.props.pushArray('settingsForm', 'shop_phones', '')}>Add phone number +</button>
          <Field
            name='shop_address'
            component={this.renderInput}
            label='Shop address'
          />
        </div>
        <div className='d-flex justify-content-start'>
          <button type='submit' className='btn btn-success mx-3'>Save</button>
          <button type='button' className='btn btn-outline-danger mx-3' onClick={this.onCancel}>Cancel</button>
        </div>
      </form>
    )
  }

  renderContent = () => {
    return (
      <div className='row'>
        <div className='col-12 col-md-6'>
          <p className='text-secondary'>{this.props.tax_label}</p>
          <p className='py-1 ps-4 fw-bold'>{this.props.tax_rate}</p>
          <p className='text-secondary'>State</p>
          <p className='py-1 ps-4 fw-bold'>{this.props.state}</p>
        </div>
        <div className='col-12 col-md-6'>
          <p className='text-secondary'>Shop name</p>
          <p className='py-1 ps-4 fw-bold'>{this.props.shop.name}</p>
          <p className='text-secondary'>Shop phone(s)</p>
          {this.renderPhones()}
          <p className='text-secondary'>Shop address</p>
          <p className='py-1 ps-4 fw-bold'>{this.props.shop.address}</p>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className='container settings-main'>
        <h4>General settings{!this.state.edit && <button className='btn text-success fs-5 p-0 mx-2' onClick={this.toggleEdit} disabled={this.props.userRole === 'admin' ? this.state.changePassword : true} type="button"><i className='bi bi-pencil-square'></i></button>}</h4>
        {this.state.edit ? this.renderEditForm() : this.renderContent()}
        {(!this.state.changePassword && !this.state.edit && !this.state.loading) && <button type='button' className='btn btn-link' onClick={this.triggerEditPassword}>Change password</button>}
        {this.state.changePassword && <EditPasswordForm onSubmit={this.changePassword} onCancel={this.cancelEditPassword} />}
        {this.state.loading && <h5>Saving password...</h5>}
        {this.state.error.length > 0 && <p className='text-danger'>{this.state.error}</p>}
        <BeatLoader loading={this.state.loading} color='#4b93ff' size={12} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    tax_label: state.settings.settings.tax_label,
    tax_rate: state.settings.settings.tax_rate,
    state: state.settings.settings.state,
    userRole: state.auth.role,
    shop: {
      name: state.settings.shop.shop_name,
      phones: state.settings.shop.shop_phones,
      address: state.settings.shop.shop_address
    }
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.tax_label) errors.tax_label = "Please enter label";

  if (!formValues.tax_rate) errors.tax_rate = "Please enter tax rate";

  if (!formValues.state) errors.state = "Please enter state";

  if (!formValues.shop_name) errors.shop_name = "Please enter shop name";

  let shopPhones = formValues.shop_phones;

  if (shopPhones) {
    shopPhones = shopPhones.filter(phone => phone);
    if (shopPhones.length === 0) errors.shop_phones = "Please enter at least one shop phone"
  }

  if (!shopPhones) errors.shop_phones = "Please enter shop phone";

  if (!formValues.shop_address) errors.shop_address = "Please enter shop address";

  return errors;
}

export default reduxForm({
  form: 'settingsForm',
  validate
})(connect(
  mapStateToProps,
  {
    updateSettings,
    reset,
    initialize,
    pushArray: arrayPush
  }
)(Settings));
