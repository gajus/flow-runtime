/* @flow */
import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';

import Example from '../Example';
import InstallInstruction from '../InstallInstruction';

const plainObjectSource = `
type User = {
  id: number;
  name: string;
};
const person: User = {
  id: 'nope',
  name: 'Bob'
};
`.trim();


const babelConfig = `
{
  "plugins": [["flow-runtime", {
    "assert": true,
    "decorate": true
  }]]
}
`.trim();

const adderExample = `
const add = (a: number, b: number): number => a + b;
console.log(add(1, 2));
console.log(add(1, false));
`.trim();

const reactExample = `
import React from 'react';

type Props = {
  name: string;
};

export class App extends React.Component<void, Props, void> {
  render () {
    return <h1>{this.props.name}</h1>;
  }
}

return (
  <App name="Hello World." />
);
`.trim();

@observer
export default class BabelPluginFlowRuntimePage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <div className="container">
            <h1>babel-plugin-flow-runtime</h1>
            <p className="lead">A babel plugin which transforms <a href="https://flowtype.org/" target="_blank">Flow</a> annotations into <code>Type</code> instances available at runtime, and optionally checks values against those types.
            </p>
            <a href="https://github.com/codemix/flow-runtime/tree/master/packages/babel-plugin-flow-runtime" className="btn btn-primary">
              <i className="fa fa-github" />
              {' '}
              babel-plugin-flow-runtime on github
            </a>
          </div>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-sm-10 offset-sm-1">
              <h4>What?</h4>
              <Example code={plainObjectSource}
                       inline
                       inputTitle={<p>A babel plugin which turns code like this:</p>}
                       outputTitle={<p>Into code like this:</p>}
              />
              <hr />
              <h4>Installation</h4>
              <InstallInstruction packageNames={['flow-runtime']}
                                  devPackageNames={['babel-plugin-flow-runtime']}
              />
              <p className="text-muted">Note: This plugin has a runtime dependency on <Link to="/flow-runtime">flow-runtime</Link></p>
              <br />
              <hr />
              <h4>Configuration</h4>
              <p>Add the following to your babel configuration or <code>.babelrc</code> file:</p>
              <pre>{babelConfig}</pre>
              <br />
              <hr />
              <h4>Options</h4>
              <p>The plugin supports the following options:</p>
              <ul>
                <li><code>assert</code> - Boolean, indicates whether types should be asserted at runtime. Defaults to <code>true</code> if <code>process.env.NODE_ENV === 'development'</code>, otherwise <code>false</code>.</li>
                <li><code>warn</code> - Boolean, if <code>true</code> flow-runtime will emit warnings instead of throwing in case of a failing check. This can be very useful when first introducing types to a codebase.</li>
                <li><code>decorate</code> - Boolean, indicates whether object or function values that have type annotations should be decorated with those types at runtime. Defaults to <code>true</code>.</li>
              </ul>
              <p>You can override these plugin options on a per-file basis using <code>//@flow-runtime</code> comments, see the <Link to="/docs/pragmas">Pragmas</Link> documentation.</p>
              <Example code={adderExample}
                       inline
                       inputTitle={<p>If <code>assert</code> is <code>true</code>, the following code:</p>}
                       outputTitle={<p>will be transformed into:</p>}
              />
              <p>This is very safe, and can be very useful during development, but has a non-trivial performance overhead. It's usually a good idea to disable this feature in production.</p>
              <hr />
              <h4>React Prop Types</h4>

              <Example code={reactExample}
                       inline
                       inputTitle={<p>When the plugin encounters a React component with a <code>props</code> type annotation, the annotation is converted to react prop types:</p>}
                       outputTitle={<p>Becomes:</p>}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

