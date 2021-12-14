import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class LoginForm extends Component {
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

  render() {
    return (
      <form className='text-start' onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
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
          <button className='btn btn-primary' type="submit">Login</button>
          <button className='btn btn-link' onClick={this.props.fpTrigger}>Forgot password</button>
        </div>
      </form>
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
})(LoginForm)
