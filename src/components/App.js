import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import history from '../history';
import Header from './Header';
import Landing from './Landing';
import ShowOrder from './ShowOrder';
import Login from './Login';
import FPTempCmp from './FPTempCmp';
import Settings from './Settings';
import Users from './Users';
import Costs from './Costs';
import Reports from './Reports';

const App = () => {
  return (
    <div>
      <Router history={history}>
        <div>
          <Header />
          <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/forgotpassword/:token" exact component={FPTempCmp} />
            <Route path="/" exact component={Landing} />
            <Route path="/order/:id" exact component={ShowOrder} />
            <Route path="/settings" exact component={Settings} />
            <Route path="/users" exact component={Users} />
            <Route path="/costs" exact component={Costs} />
            <Route path="/reports" exact component={Reports} />
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App;
