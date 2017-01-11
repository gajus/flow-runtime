/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Link, IndexLink} from 'react-router';

type Props = {
  children: *;
};

@observer
export default class DocsPage extends Component<void, Props, void> {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3 col-lg-2 no-gutter">
            <nav className="nav nav-pills nav-stacked">
              <IndexLink className="nav-item nav-link" activeClassName="active" to="/docs">Getting Started</IndexLink>
              <Link className="nav-item nav-link" activeClassName="active" to="/docs/primitive-types">Primitive Types</Link>
              <Link className="nav-item nav-link" activeClassName="active" to="/docs/object-types">Object Types</Link>
              <Link className="nav-item nav-link" activeClassName="active" to="/docs/arrays-and-tuples">Arrays & Tuples</Link>
              <Link className="nav-item nav-link" activeClassName="active" to="/docs/functions">Functions</Link>
              <Link className="nav-item nav-link" activeClassName="active" to="/docs/type-aliases">Type Aliases</Link>
              <Link className="nav-item nav-link" activeClassName="active" to="/docs/type-context">Type Contexts</Link>
              <Link className="nav-item nav-link" activeClassName="active" to="/docs/unions-and-intersections">Unions & Intersections</Link>
              <Link className="nav-item nav-link" activeClassName="active" to="/docs/type-inference">Type Inference</Link>
              <Link className="nav-item nav-link" activeClassName="active" to="/docs/exotic-types">Exotic Types</Link>
              <Link className="nav-item nav-link" activeClassName="active" to="/docs/type-refinements">Type Refinements</Link>
              <Link className="nav-item nav-link" activeClassName="active" to="/docs/validation">Validation & Error Reporting</Link>
              <Link className="nav-item nav-link" activeClassName="active" to="/docs/pattern-matching">Pattern Matching</Link>
            </nav>
          </div>
          <div className="col-sm-9 col-lg-10 no-gutter">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

