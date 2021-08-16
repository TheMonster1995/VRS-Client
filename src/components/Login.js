import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BeatLoader } from 'react-spinners';

import {
  loginAction
} from '../actions';
import repairShopApi from '../apis/repairShopApi';
import {
  encrypt
} from '../helper';
import LoginForm from './LoginForm';
import FPForm from './FPForm';
import NewPForm from './NewPForm';

class Login extends Component {
  state = {error: '', loading: false, section: 'login', forgotToken: null};

  componentDidMount() {
    if (!this.props.location.state) return;

    let { section, forgotToken } = this.props.location.state;

    this.setState({section, forgotToken});
    this.props.history.replace({...this.props.location, state: undefined})
  }

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

  toggleFp = () => {
    if (this.state.section !== 'fp') return this.setState({section: 'fp'});

    return this.setState({section: 'login', error: ''})
  }

  backToLogin = () => this.setState({section: 'login', error: ''})

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
      return this.setState({error: 'Bad username/password', loading: false})
    }

    this.props.loginAction(check.data.payload.accessToken, check.data.payload.role);
    this.props.history.push('/')
  }

  sendFpLink = async ({email}) => {
    this.setState({loading: true});
    let sendLink;

    try {
      sendLink = await repairShopApi.get(
        '/password/forgot/link',
        {
          headers: {
            usermail: email
          }
        }
      )
    } catch (err) {
      return this.setState({error: `There was a problem sending the link. Try again or contact support`, loading: false})
    }

    this.setState({
      loading: false,
      section: 'fpText',
      error: ''
    })
  }

  saveNewPassword = async ({password}) => {
    this.setState({loading: true});
    let encPassword = encrypt(password);

    let savePassword;

    try {
      savePassword = await repairShopApi.post(
        '/password/forgot',
        {
          newpassword: encPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'forgottoken': this.state.forgotToken
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
      section: 'savePText',
      error: ''
    })

    this.props.loginAction(savePassword.data.payload.accessToken, savePassword.data.payload.role);

    setTimeout(() => {
      this.props.history.push('/')
    }, 3000)
  }

  renderCardContent = () => {
    switch (this.state.section) {
      case 'login':
        return <LoginForm
          onSubmit={this.checkAuth}
          fpTrigger={this.toggleFp}
        />

      case 'fp':
        return <FPForm
          onSubmit={this.sendFpLink}
          fpTrigger={this.toggleFp}
        />

      case 'newp':
        return <NewPForm
          onSubmit={this.saveNewPassword}
          onCancel={this.backToLogin}
        />

      case 'fpText':
        return <div className='card-text'>A reset password link has been sent to your email address</div>;

      case 'savePText':
        return <div className='card-text'>Saving password...</div>
    }
  }

  renderCardTitle = () => {
    switch (this.state.section) {
      case 'login':
        return 'Login'

      case 'fp':
      case 'fpText':
        return 'Forgot password'

      case 'newp':
      case 'savePText':
        return 'Reset password'
    }
  }

  render() {
    console.log('in render');
    console.log(this.props);
    return (
      <section className='login-section container text-center'>
        <h2 className='fs-xs-4'><i className="bi bi-tools"></i> Vehicle Repairshop <i className="bi bi-tools"></i></h2>
        <div className='card mx-auto mt-5 w-xl-25 w-lg-30 w-md-40 w-sm-50'>
          <div className='card-body'>
            <h5 className='card-title'>{this.renderCardTitle()}</h5>
            {this.state.error.length > 0 && <h6 className='text-danger'>{this.state.error}</h6>}
            <BeatLoader loading={this.state.loading} color='#4b93ff' size={12} />
            {this.renderCardContent()}
          </div>
        </div>
      </section>
    )
  }
}

export default connect(null, { loginAction })(Login)
