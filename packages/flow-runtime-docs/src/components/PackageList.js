/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';

@observer
export default class PackageList extends Component {
  render() {
    return (
      <div className="list-group">
        <Link to="/flow-runtime" className="list-group-item list-group-item-action">
          <h5 className="list-group-item-heading">
            flow-runtime
          </h5>
          <p className="list-group-item-text">The core runtime library, responsible for representing types, validation, error messages etc.</p>
        </Link>
        <Link to="/babel-plugin-flow-runtime" className="list-group-item list-group-item-action">
          <h5 className="list-group-item-heading">
            babel-plugin-flow-runtime
          </h5>
          <p className="list-group-item-text">
            A babel plugin which transforms static type annotations into <samp>flow-runtime</samp> type declarations.
          </p>
        </Link>
        <Link to="/flow-runtime-mobx" className="list-group-item list-group-item-action">
          <h5 className="list-group-item-heading">
            flow-runtime-mobx
          </h5>
          <p className="list-group-item-text">
            Adds mobx support to flow-runtime.
          </p>
        </Link>
        <Link to="/flow-config-parser" className="list-group-item list-group-item-action">
          <h5 className="list-group-item-heading">
            flow-config-parser
          </h5>
          <p className="list-group-item-text">
            Parses <samp>.flowconfig</samp> files and makes them available to JavaScript.
          </p>
        </Link>
      </div>
    );
  }
}

