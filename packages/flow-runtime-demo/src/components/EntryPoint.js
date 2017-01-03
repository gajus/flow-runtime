/* @flow */
import React from 'react';

import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import App from './App';

import HomePage from './HomePage';
import TryPage from './TryPage';
import DocsPage from './DocsPage';

import GettingStartedPage from './docs/GettingStartedPage';
import ObjectTypesPage from './docs/ObjectTypesPage';

export default function EntryPoint () {
  return (
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={HomePage} />
        <Route path="docs" component={DocsPage}>
          <IndexRoute component={GettingStartedPage} />
          <Route path="object-types" component={ObjectTypesPage} />
        </Route>
        <Route path="try" component={TryPage} />
      </Route>
    </Router>
  );
}