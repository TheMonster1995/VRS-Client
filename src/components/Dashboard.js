import react, { Component } from 'react';

import Users from './Users';
import Settings from './Settings';
import Reports from './Reports';

class Dashboard extends Component {
  state = {
    active: 'users'
  }

  renderContent = () => {
    switch (this.state.active) {
      case 'users':
        return <Users />

      case 'settings':
        return <Settings />

      case 'reports':
        return <Reports />
    }
  }

  render() {
    return (
      <div className="d-flex align-items-start container flex-wrap flex-lg-nowrap">
        <div className="nav flex-lg-column nav-pills pe-3 border-end border-bottom">
          <button className={`nav-link ${this.state.active === 'users' && 'active'}`} type="button" onClick={() => this.setState({active: 'users'})}>User management</button>
          <button className={`nav-link ${this.state.active === 'settings' && 'active'}`} type="button" role="tab" onClick={() => this.setState({active: 'settings'})}>General settings</button>
          <button className={`nav-link ${this.state.active === 'reports' && 'active'}`} type="button" role="tab" onClick={() => this.setState({active: 'reports'})}>Reports and graphs</button>
        </div>
        <div className='w-85'>
          {this.renderContent()}
        </div>
      </div>
    )
  }
}

export default Dashboard;
