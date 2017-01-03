/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Link, IndexLink} from 'react-router';

import CodeInput from './CodeInput';
import CodeOutput from './CodeOutput';

type Props = {
  children: *;
};

@observer
export default class DocsPage extends Component<void, Props, void> {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3 col-lg-2">
            <nav className="nav nav-pills nav-stacked">
              <IndexLink className="nav-item nav-link" activeClassName="active" to="/docs">Getting Started</IndexLink>
              <Link className="nav-item nav-link" activeClassName="active" to="/docs/object-types">Object Types</Link>
            </nav>
          </div>
          <div className="col-sm-9 col-lg-10">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

