/* @flow */

import React, { Component } from 'react';
import {observer, Provider} from 'mobx-react';
import './App.css';
import store from '../store';

import Navbar from './Navbar';

type Props = {
  children: *;
};

@observer
export default class App extends Component<void, Props, void> {
  render() {
    return (
      <div className="App">
        <Navbar />
        {this.props.children}
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}

