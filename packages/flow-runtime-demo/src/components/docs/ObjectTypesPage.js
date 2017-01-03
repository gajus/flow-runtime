/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Link, IndexLink} from 'react-router';

import Example from '../Example';

const plainObjectSource = `
type Thing = {
  name: string;
  url: string;
};
`

@observer
export default class ObjectTypesPage extends Component {
  render() {
    return (
      <div>
        <header className="page-header">
          <h1>Object Types</h1>
        </header>
        <Example id="plainObject" code={plainObjectSource} />
      </div>
    );
  }
}

