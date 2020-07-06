/* @flow */

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './components/index.css';

import t from 'flow-runtime';
import * as mobx from 'mobx';
import flowRuntimeMobx from 'flow-runtime-mobx';

flowRuntimeMobx(t, mobx);

import React from 'react';
import ReactDOM from 'react-dom';
import EntryPoint from './components/EntryPoint';

global.t = t;

ReactDOM.render(
  <EntryPoint />,
  document.getElementById('root')
);
