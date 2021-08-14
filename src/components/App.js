import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import history from '../history';
import Header from './Header';
import Landing from './Landing';
import ShowOrder from './ShowOrder';
import Login from './Login';

const App = () => {
  return (
    <div className="p-3">
      <Router history={history}>
        <div>
          <Header />
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/order/:id" exact component={ShowOrder} />
            <Route path="/login" exact component={Login} />
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App;
