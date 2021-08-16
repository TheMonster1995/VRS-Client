import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class NewPForm extends Component {
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
          name='password'
          component={this.renderInput}
          label='Password'
          parentClass='mb-3'
          type='password'
        />
        <Field
          name='repeatPassword'
          component={this.renderInput}
          label='Repeat password'
          parentClass='mb-3'
          type='password'
        />
        <div className='mb-2'>
          <button className='btn btn-primary' type="submit">Save</button>
          <button className='btn btn-link' onClick={this.props.onCancel}>Cancel</button>
        </div>
      </form>
    )
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.password) errors.password = "Please enter new password";

  if (!formValues.repeatPassword) errors.repeatPassword = "Please repeat the password";

  if (formValues.password && formValues.password.length < 8) errors.password = "Password should be 8 characters or more";

  if (formValues.password && formValues.repeatPassword && formValues.password !== formValues.repeatPassword) errors.repeatPassword = "Passwords do not match";

  return errors;
}

export default reduxForm({
  form: 'newPForm',
  validate
})(NewPForm)
