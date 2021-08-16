import react, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, reset, initialize } from 'redux-form';
import * as _ from 'lodash';

import {
  getUsers,
  saveUser,
  deleteUser
} from '../actions';

class Users extends Component {
  state = {
    users: [],
    edit: false,
    submitBlocked: true,
    userInEdit: null,
    usernameError: false,
    delete: false,
    userInDelete: null,
    new: false
  }

  componentDidMount() {
    if (
      this.props.isSignedIn &&
      (
        !this.props.users ||
        this.props.users.length === 0
      )
    ) return this.props.getUsers();

    if (
      this.props.isSignedIn &&
      this.props.users
    ) this.addUsersToState()
  }

  componentDidUpdate() {
    if (
      this.props.isSignedIn &&
      !this.props.getCalled
    ) return this.props.getUsers();

    return this.addUsersToState();
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

  capitalize = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

  renderSelect = ({ input, options }) => {
    return (
      <select {...input} className="form-select">
        {options.map((option, i) => <option value={option} key={i}>{this.capitalize(option)}</option>)}
      </select>
    )
  }

  addUsersToState = () => {
    if (this.state.edit || this.state.new || this.state.delete) return;
    let users = this.props.users;

    users = users.map(user => ({...user, edit: false}));

    if (_.isEqual(users, this.state.users)) return;

    this.setState({users});
  }

  toggleEdit = userId => {
    let newUsers = [...this.state.users];
    let userIndex = this.state.users.findIndex(user => user.user_id === userId)

    newUsers[userIndex]['edit'] = true;

    this.props.initialize('userForm', this.state.users[userIndex])
    this.setState({
      users: newUsers,
      edit: true,
      userInEdit: {
        username: this.state.users[userIndex]['username'],
        email: this.state.users[userIndex]['email']
      }
    })
  }

  toggleNew = () => this.setState({new: true});

  onSubmit = formValues => {
    console.log('here');
    console.log(formValues);
    let type = 'new';

    if (formValues.user_id && formValues.user_id !== '') type = 'update';

    this.props.saveUser(formValues, type);
    this.props.reset('userForm');
    this.setState({
      edit: false,
      new: false,
      userInEdit: false,
      submitBlocked: true,
      usernameError: null
    })
  }

  onCancel = () => {
    console.log('on cancel called');
    let newUsers = [...this.state.users];
    let userIndex = this.state.users.findIndex(user => user.username === this.state.userInEdit.username)

    newUsers[userIndex]['edit'] = false;
    this.props.reset('userForm');
    this.setState({
      users: newUsers,
      edit: false,
      userInEdit: null,
      submitBlocked: true
    })
  }

  onNewCancel = () => {
    this.props.reset('userForm');
    this.setState({
      new: false
    })
  }

  renderDeletePopup = () => {
    return (
      <div className='position-absolute delete-popup-parent'>
        <div className='p-3 bg-white rounded text-center w-50 mx-auto my-5'>
          <p>Are you sure you want to delete this user?</p>
          <button className='btn btn-secondary mx-3' onClick={this.toggleDelete}>Cancel</button>
          <button className='btn btn-outline-danger mx-3' onClick={this.deleteUser}>Delete</button>
        </div>
      </div>
    )
  }

  toggleDelete = (userId = null) => this.setState({delete: !this.state.delete, userInDelete: userId});

  deleteUser = () => {
    let userId = this.state.userInDelete;
    let newUsers = this.state.users.filter(user => user.user_id !== userId);

    this.setState({
      delete: false,
      userInDelete: null,
      users: newUsers
    })
    this.props.deleteUser(userId);
  }

  usernameCheck = val => {
    if (!val) return;
    if (this.state.userInEdit && val === this.state.userInEdit.username) return;

    let usernames = this.state.users.map(user => user.username.toLowerCase());

    if (usernames.indexOf(val.toLowerCase()) === -1) return;

    return 'Username exists';
  }

  emailCheck = val => {
    if (!val) return;
    if (this.state.userInEdit && val === this.state.userInEdit.email) return;

    let emails = this.state.users.map(user => user.email.toLowerCase());

    if (emails.indexOf(val.toLowerCase()) === -1) return;

    return 'Email exists';
  }

  generateUsersRows = () => this.state.users.map((row, i) => {
    if (!row.edit) return (
      <tr key={i}>
        <td>{row.user_id}</td>
        <td>{row.name}</td>
        <td>{row.email}</td>
        <td>{row.username}</td>
        <td>{row.role}</td>
        <td>{row.status}</td>
        <td>
          {(this.props.userRole === 'admin' || this.props.username === row.username) &&
            <>
              <button className='btn text-success fs-5 p-0 mx-2' onClick={this.toggleEdit.bind(this, row.user_id)} disabled={this.state.edit} type="button"><i className='bi bi-pencil-square'></i></button>
              <button className='btn text-danger fs-5 p-0 mx-2' disabled={this.state.edit} type="button" onClick={this.toggleDelete.bind(this, row.user_id)}><i className='bi bi-trash'></i></button>
            </>
          }
        </td>
      </tr>
    )

    return (
      <tr key={i}>
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
            onBlur={() => !this.state.usernameError && this.setState({submitBlocked: false})}
          />
        </td>
        <td className='w-17'>
          <Field
            name='email'
            component={this.renderInput}
            label='JohnDoe@gmail.com'
            validate={this.emailCheck}
            onBlur={() => !this.state.usernameError && this.setState({submitBlocked: false})}
          />
        </td>
        <td className='w-17'>
          <Field
            name='username'
            component={this.renderInput}
            label='JohnDoe95'
            validate={this.usernameCheck}
            onBlur={() => !this.state.usernameError && this.setState({submitBlocked: false})}
          />
        </td>
        <td className='w-17'>
          <Field
            name='role'
            component={this.renderSelect}
            options={['admin', 'user']}
            onChange={() => !this.state.usernameError && this.setState({submitBlocked: false})}
          />
        </td>
        <td className='w-17'>
          <Field
            name='status'
            component={this.renderSelect}
            options={['active', 'inactive']}
            onChange={() => !this.state.usernameError && this.setState({submitBlocked: false})}
          />
        </td>
        <td className='w-17'>
          <button className='btn text-success fs-4 p-0 mx-2' type='submit' disabled={this.state.submitBlocked}><i className='bi bi-check-circle'></i></button>
          <button className='btn text-danger fs-4 p-0 mx-2' onClick={this.onCancel} type="button"><i className='bi bi-x-circle'></i></button>
        </td>
      </tr>
    )
  })

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
          <button className='btn text-success fs-4 p-0 mx-2' type='submit'><i className='bi bi-check-circle'></i></button>
          <button className='btn text-danger fs-4 p-0 mx-2' onClick={this.onNewCancel} type="button"><i className='bi bi-x-circle'></i></button>
        </td>
      </tr>
    )
  }

  render() {
    return (
      <div className='ps-lg-4 pt-lg-0 pt-4 ps-2 position-relative'>
        <h4>User management</h4>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Username</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.generateUsersRows()}
              {this.state.new && this.generateNewRow()}
            </tbody>
          </table>
        </form>
        {!this.state.new && <button className='btn btn-link' type="button" onClick={this.toggleNew}>+ Add user</button>}
        {this.state.delete && this.renderDeletePopup()}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.users.users,
    getCalled: state.users.getCalled,
    isSignedIn: state.auth.isSignedIn,
    userRole: state.auth.role,
    username: state.auth.username
  }
}

const validate = formValues => {
  const errors = {};
  const mailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  if (!formValues.name) errors.name = "Please enter user's name";

  if (!formValues.email) errors.email = "Please enter user's email address";

  if (formValues.email && !mailRegex.test(formValues.email)) errors.email = 'Invalid email address'

  if (!formValues.username) errors.username = "Please enter a username";

  return errors;
}

export default reduxForm({
  form: 'userForm',
  validate
})(connect(
  mapStateToProps,
  {
    getUsers,
    saveUser,
    deleteUser,
    reset,
    initialize
  }
)(Users));
