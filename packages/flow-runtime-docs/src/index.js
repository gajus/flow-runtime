/* @flow */

import 'regenerator-runtime/runtime';
import './typedefs';

import t from 'flow-runtime';
import * as mobx from 'mobx';
import flowRuntimeMobx from 'flow-runtime-mobx';

flowRuntimeMobx(t, mobx);

import React from 'react';
import ReactDOM from 'react-dom';
import EntryPoint from './components/EntryPoint';
import './components/index.css';

import '../assets/common.scss';

global.t = t;

ReactDOM.render(
  <EntryPoint />,
  document.getElementById('root')
);
