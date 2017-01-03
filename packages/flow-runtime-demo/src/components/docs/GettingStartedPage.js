/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Link, IndexLink} from 'react-router';

import Example from '../Example';

@observer
export default class GettingStartedPage extends Component {
  render() {
    return (
      <div>
        <header className="page-header">
          <h1>Getting Started</h1>
        </header>
      </div>
    );
  }
}

