import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class FPForm extends Component {
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
          name='email'
          component={this.renderInput}
          label='Email address'
          parentClass='mb-3'
        />
        <div className='mb-2'>
          <button className='btn btn-primary' type="submit">Send link</button>
          <button className='btn btn-link' onClick={this.props.fpTrigger}>Go back</button>
        </div>
      </form>
    )
  }
}

const validate = formValues => {
  const errors = {};
  const mailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  if (!formValues.email) errors.email = "Please enter your email address";

  if (!mailRegex.test(formValues.email)) errors.email = "Email address is not valid"

  return errors;
}

export default reduxForm({
  form: 'fpForm',
  validate
})(FPForm);
