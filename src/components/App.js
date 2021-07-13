import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import Landing from './Landing';
import Header from './Header';
import history from '../history';

const App = () => {
  return (
    <div className="p-3">
      <Router history={history}>
        <div>
          <Header />
          <Switch>
            <Route path="/" exact component={Landing} />
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App;
