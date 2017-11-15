/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';

import PackageList from './PackageList';

type Props = {};

@observer
export default class PackageListPage extends Component<Props, void> {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <div className="container">
            <h1>Packages</h1>
            <p className="lead"></p>
          </div>
        </header>
        <div className="container">
          <p className="lead">This project is a mono-repo, composed of the following modules:</p>
          <PackageList />
          <br /><br />
          <p className="lead">You can find us on Github at <a href="https://github.com/codemix/flow-runtime">https://github.com/codemix/flow-runtime</a></p>
        </div>
      </div>
    );
  }
}

