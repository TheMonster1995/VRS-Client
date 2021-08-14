import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { BeatLoader } from 'react-spinners';

import { loginAction } from '../actions';
import repairShopApi from '../apis/repairShopApi';
import {
  encrypt
} from '../helper';

class Login extends Component {
  state = {error: '', loading: false};

  renderInput = ({ input, label, meta, parentClass, inputClass, type }) => {
    return (
      <div className={`${parentClass}`}>
        <label className="form-label">{label}</label>
        <input {...input} className={`form-control border-0 rounded-0 border-bottom ${inputClass}`} type={type || 'text'}/>
        {this.renderError(meta)}
      </div>
    );
  }

  renderError = ({ error, touched }) => (touched && error) && <small className="form-text text-danger d-block">{error}</small>;

  checkAuth = async ({username, password}) => {
    this.setState({loading: true})
    let encPassword = encrypt(password);

    let check;

    try {
      check = await repairShopApi.post(
        '/login',
        {
          username,
          password: encPassword
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )
    } catch (err) {
      this.setState({error: 'Bad username/password', loading: false})
      return this.props.reset('loginForm');
    }

    this.props.reset('loginForm');
    this.props.loginAction(check.data.payload.accessToken, check.data.payload.role);
    this.props.history.push('/')
  }

  render() {
    return (
      <section className='login-section container text-center'>
        <h2 className='fs-xs-4'><i className="bi bi-tools"></i> Vehicle Repairshop <i className="bi bi-tools"></i></h2>
        <div className='card mx-auto mt-5 w-xl-25 w-lg-30 w-md-40 w-sm-50'>
          <div className='card-body'>
            <h5 className='card-title'>Login</h5>
            {this.state.error.length > 0 && <h6 className='text-danger'>{this.state.error}</h6>}
            <BeatLoader loading={this.state.loading} color='#4b93ff' size={12} />
            <form className='text-start' onSubmit={this.props.handleSubmit(this.checkAuth)}>
              <Field
                name='username'
                component={this.renderInput}
                label='Username'
                parentClass='mb-3'
              />
              <Field
                name='password'
                component={this.renderInput}
                label='Password'
                parentClass='mb-3'
                type='password'
              />
              <div className='mb-2'>
                <button className='btn btn-primary'>Login</button>
                <button className='btn btn-link'>Forgot password</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.username) errors.username = "Please enter your usename";

  if (!formValues.password) errors.password = "Please enter your password";

  if (formValues.password && formValues.password.length < 8) errors.password = "Password should be 8 characters or more";

  return errors;
}

export default reduxForm({
  form: 'loginForm',
  validate
})(connect(null, { loginAction })(Login))
