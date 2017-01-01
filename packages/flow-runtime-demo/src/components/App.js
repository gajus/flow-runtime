/* @flow */

import React, { Component } from 'react';
import {observer, Provider} from 'mobx-react';
import logo from './logo.svg';
import './App.css';
import store from '../store';

import CodeInput from './CodeInput';
import CodeOutput from './CodeOutput';

@observer
export default class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Flow Runtime Demo App</h2>
        </div>
        <p className="App-intro">

        </p>
        <Provider store={store}>
          <div className="Wrapper">
            <CodeInput value={store.code} />
            <CodeOutput value={store.transformed} />
          </div>
        </Provider>
      </div>
    );
  }
}

