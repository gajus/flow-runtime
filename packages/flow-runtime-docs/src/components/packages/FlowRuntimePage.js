/* @flow */
import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';

import InstallInstruction from '../InstallInstruction';
import Example from '../Example';

const simpleExample = `
import t from 'flow-runtime';

const UserType = t.object({
  id: t.number(),
  name: t.string()
});

UserType.assert({
  id: 123,
  name: 'Sally'
});

UserType.assert({
  id: false,
  name: 'Bob'
});
`.trim();

@observer
export default class FlowRuntimePage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <div className="container">
            <h1>flow-runtime</h1>
            <p className="lead">A runtime type system for JavaScript with full  <a href="https://flowtype.org/" target="_blank">Flow</a> compatibility.
            </p>
            <a href="https://github.com/codemix/flow-runtime/tree/master/packages/flow-runtime" className="btn btn-primary">
              <i className="fab fa-github" />
              {' '}
              flow-runtime on github
            </a>
          </div>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-sm-10 offset-sm-1">
              <h4>What?</h4>
              <p>Provides a rich API for defining, inspecting and verifying data types in JavaScript. Any value that can be represented in JS can be represented by <code>flow-runtime</code>, including full support for polymorphism and parameterized types.</p>
              <p>This is the core library, see the <Link to="/">flow-runtime</Link> homepage for more information.</p>
              <hr />
              <h4>Installation</h4>
              <InstallInstruction packageNames={['flow-runtime']} />
              <hr />
              <h4>Usage</h4>
              <Example code={simpleExample} inline hideOutput inputTitle={<p>See the <Link to="/docs">documentation</Link> for more examples.</p>}/>
              <br />
              <br />

            </div>
          </div>
        </div>
      </div>
    );
  }
}

