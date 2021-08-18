import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import history from '../history';
import Header from './Header';
import Landing from './Landing';
import ShowOrder from './ShowOrder';
import Login from './Login';
import FPTempCmp from './FPTempCmp';
import Dashboard from './Dashboard';
import ShareOrder from './ShareOrder';

const App = () => {
  return (
    <div className="p-3">
      <Router history={history}>
        <div>
          <Header />
          <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/forgotpassword/:token" exact component={FPTempCmp} />
            <Route path="/" exact component={Landing} />
            <Route path="/order/:id" exact component={ShowOrder} />
            <Route path="/share/:id" exact component={ShareOrder} />
            <Route path="/dashboard" exact component={Dashboard} />
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App;
