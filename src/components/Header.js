import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  getOrders,
  logoutAction,
  checkSignIn,
  getSettings,
  toggleForm
} from '../actions';
import './header.css';
import Search from './Search';

class Header extends Component {
  state = {
    sideExpanded: false,
    menuOpen: false
  }

  componentDidMount() {
    if (
      this.props.isSignedIn &&
      (
        this.props.location.pathname === '/login' ||
        this.props.location.pathname.indexOf('forgotpassword') !== -1
      )
    ) return this.props.history.push('/');

    if (
      this.props.isSignedIn === false &&
      this.props.location.pathname.indexOf('forgotpassword') !== -1
    ) return;

    if (
      this.props.isSignedIn === false &&
      this.props.location.pathname !== '/login' &&
      this.props.location.pathname.indexOf('forgotpassword') === -1
    ) return this.props.history.push('/login');

    if (this.props.isSignedIn === null) return this.props.checkSignIn();

    if (!this.props.isSignedIn) return;

    if (!this.props.settingsSet) this.props.getSettings();

    if (!this.props.getCalled) return this.props.getOrders();
  }

  componentDidUpdate() {
    if (
      this.props.isSignedIn &&
      (
        this.props.location.pathname === '/login' ||
        this.props.location.pathname.indexOf('forgotpassword') !== -1
      )
    ) return this.props.history.push('/');

    if (
      this.props.isSignedIn === false &&
      this.props.location.pathname.indexOf('forgotpassword') !== -1
    ) return;

    if (
      this.props.isSignedIn === false &&
      this.props.location.pathname !== '/login' &&
      this.props.location.pathname.indexOf('forgotpassword') === -1
    ) return this.props.history.push('/login');

    if (this.props.isSignedIn === null) return this.props.checkSignIn();

    if (!this.props.isSignedIn) return;

    if (!this.props.settingsSet) this.props.getSettings();

    if (!this.props.getCalled) return this.props.getOrders();
  }

  signOut = () => {
    this.props.logoutAction();
    this.props.history.push('/login')
  }

  toggleMenu = () => this.setState({menuOpen: !this.state.menuOpen})

  handleReroute = route => {
    if (this.props.location.pathname === route) return;

    this.props.history.push(route)
  }

  newOrderToggle = () => {
    if (this.props.newOrderForm) return;

    this.props.toggleForm();

    if (this.props.location.pathname !== '/') this.props.history.push('/');

    window.scrollTo(0, 0);
  }

  render() {
    let currentPage = this.props.location?.pathname.replace('/', '') || '';

    return (
      <>
        <header className={`d-flex flex-wrap align-items-center justify-content-start py-3 mb-4 position-fixed w-100 ${!this.props.isSignedIn && 'd-none'}`}>
          <div className='d-flex col-md-3 mb-2 mb-md-0 side-bar-parent' onMouseEnter={() => {this.setState({sideExpanded: true})}} onMouseLeave={() => {this.setState({sideExpanded: false})}}>
            <div className={`side-bar-main position-fixed d-flex flex-column justify-content-start ${this.state.sideExpanded && 'expanded'}`}>
              <div className={`mx-3 my-2 rounded-pill side-bar-btn-parent d-flex justify-content-between ${currentPage === '' && 'active'}`}>
                <button className="btn py-1 px-2 d-flex fw-bold" type='button' onClick={this.handleReroute.bind(this, '/')}><i className="bi bi-file-text"></i><span className='ms-3'>Orders</span></button>
                <button className='btn fs-5 float-end pt-0' type='button' onClick={this.newOrderToggle}><i className='bi bi-plus'></i></button>
              </div>
              <div className={`mx-3 my-2 rounded-pill side-bar-btn-parent d-flex justify-content-between ${currentPage === 'users' && 'active'}`}>
                <button className="btn py-1 px-2 d-flex fw-bold" type='button' onClick={this.handleReroute.bind(this, '/users')}><i className="bi bi-people"></i><span className='ms-3'>Users</span></button>
              </div>
              <div className={`mx-3 my-2 rounded-pill side-bar-btn-parent d-flex justify-content-between ${currentPage === 'settings' && 'active'}`}>
                <button className="btn py-1 px-2 d-flex fw-bold" type='button' onClick={this.handleReroute.bind(this, '/settings')}><i className="bi bi-gear"></i><span className='ms-3'>Settings</span></button>
              </div>
              <div className={`mx-3 my-2 rounded-pill side-bar-btn-parent d-flex justify-content-between ${currentPage === 'costs' && 'active'}`}>
                <button className="btn py-1 px-2 d-flex fw-bold" type='button' onClick={this.handleReroute.bind(this, '/costs')}><i className="bi bi-calendar4-range"></i><span className='ms-3'>Costs</span></button>
              </div>
              <div className={`mx-3 my-2 rounded-pill side-bar-btn-parent d-flex justify-content-between ${currentPage === 'reports' && 'active'}`}>
                <button className="btn py-1 px-2 d-flex fw-bold" type='button' onClick={this.handleReroute.bind(this, '/reports')}><i className="bi bi-bar-chart-line"></i><span className='ms-3'>Reports</span></button>
              </div>
              <div className='mx-3 my-2 rounded-pill side-bar-btn-parent d-flex justify-content-between'>
                <button className="btn py-1 px-2 d-flex fw-bold" type='button' onClick={this.signOut}><i className="bi bi-box-arrow-left"></i><span className='ms-3'>Sign out</span></button>
              </div>
            </div>
          </div>

          <div className="text-end open-menu-div w-10">
            {this.props.isSignedIn &&
              <button className="btn btn-dark mx-3" type='button' onClick={this.toggleMenu}><i className="bi bi-list"></i></button>
            }
            <div className='menu-parent'>
              <div className={`menu-main position-fixed d-flex flex-column justify-content-start ${this.state.menuOpen && 'open'}`}>
                <div className={`mx-3 my-2 rounded-pill menu-btn-parent d-flex justify-content-between ${currentPage === '' && 'active'}`}>
                  <button className="btn py-1 px-2 d-flex fw-bold" type='button'onClick={this.handleReroute.bind(this, '/')}><i className="bi bi-file-text"></i><span className='ms-3'>Orders</span></button>
                  <button className='btn fs-5 float-end pt-0' type='button' onClick={this.newOrderToggle}><i className='bi bi-plus'></i></button>
                </div>
                <div className={`mx-3 my-2 rounded-pill menu-btn-parent d-flex justify-content-between ${currentPage === 'users' && 'active'}`}>
                  <button className="btn py-1 px-2 d-flex fw-bold" type='button' onClick={this.handleReroute.bind(this, '/users')}><i className="bi bi-people"></i><span className='ms-3'>Users</span></button>
                </div>
                <div className={`mx-3 my-2 rounded-pill menu-btn-parent d-flex justify-content-between ${currentPage === 'settings' && 'active'}`}>
                  <button className="btn py-1 px-2 d-flex fw-bold" type='button' onClick={this.handleReroute.bind(this, '/settings')}><i className="bi bi-gear"></i><span className='ms-3'>Settings</span></button>
                </div>
                <div className={`mx-3 my-2 rounded-pill menu-btn-parent d-flex justify-content-between ${currentPage === 'costs' && 'active'}`}>
                  <button className="btn py-1 px-2 d-flex fw-bold" type='button' onClick={this.handleReroute.bind(this, '/costs')}><i className="bi bi-calendar4-range"></i><span className='ms-3'>Costs</span></button>
                </div>
                <div className='mx-3 my-2 rounded-pill menu-btn-parent d-flex justify-content-between'>
                  <button className="btn py-1 px-2 d-flex fw-bold" type='button' onClick={this.signOut}><i className="bi bi-box-arrow-left"></i><span className='ms-3'>Sign out</span></button>
                </div>
              </div>
            </div>
          </div>

          {this.props.isSignedIn &&
            <Search
              orders={this.props.orders}
            />
          }
        </header>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    orders: state.orders.orders,
    isSignedIn: state.auth.isSignedIn,
    getCalled: state.orders.getCalled,
    settingsSet: state.settings.set,
    newOrderForm: state.orders.new
  };
}

export default connect(mapStateToProps, {
  getOrders,
  logoutAction,
  checkSignIn,
  getSettings,
  toggleForm
})(withRouter(Header));

// <Link className="btn btn-outline-primary btn-sm" to={this.props.location.pathname === "/dashboard" ? "/" : "/dashboard"}>{this.props.location.pathname === '/dashboard' ? 'Home' : 'Dashboard'}</Link>
// <Link className={`text-dark text-decoration-none btn btn-link ${this.props.isSignedIn && 'd-sm-block d-none'}`} to='/'>
//   LOGO
// </Link>
