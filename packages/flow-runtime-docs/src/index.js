/* @flow */

import t from 'flow-runtime';
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
