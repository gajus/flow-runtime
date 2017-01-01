/* @flow */

import t from 'flow-runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './components/index.css';

global.t = t;

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
