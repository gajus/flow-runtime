/* @flow */
import React, { Component } from 'react';
import {observer} from 'mobx-react';

import CodeMirror from '../CodeMirror';
import InstallInstruction from '../InstallInstruction';

const inputExample = `
/* @flow */
function get (store: Storage, key: string) {
  return store.getItem(key);
}

get(localStorage, 'foo');
`.trim();

const outputExample = `
import t from "flow-runtime";
t.declare(
  t.class(
    "Storage",
    t.object(
      t.property("length", t.number()),
      t.property(
        "getItem",
        t.function(t.param("key", t.string()), t.return(t.nullable(t.string())))
      ),
      t.property(
        "setItem",
        t.function(
          t.param("key", t.string()),
          t.param("data", t.string()),
          t.return(t.void())
        )
      ),
      t.property("clear", t.function(t.return(t.void()))),
      t.property(
        "removeItem",
        t.function(t.param("key", t.string()), t.return(t.void()))
      ),
      t.property(
        "key",
        t.function(
          t.param("index", t.number()),
          t.return(t.nullable(t.string()))
        )
      ),
      t.indexer("name", t.string(), t.nullable(t.string()))
    )
  )
);
`.trim();

@observer
export default class FlowRuntimeCLIPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <div className="container">
            <h1>flow-runtime-cli</h1>
              <p className="lead">
                A command line utility for working with flow and flow-runtime.
            </p>
            <a href="https://github.com/codemix/flow-runtime/tree/master/packages/flow-runtime-cli" className="btn btn-primary">
              <i className="fab fa-github" />
              {' '}
              flow-runtime-cli on github
            </a>
          </div>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-sm-10 offset-sm-1">
              <h4>What?</h4>
              <p>Discovers imported and global type dependencies in your source code and produces a single file containing the flow-runtime type definitions for those dependencies.</p>
              <h4>What?</h4>
              <p>Let's say you have some code like this:</p>
              <CodeMirror value={inputExample} readOnly />
              <br /><br />
              <p><samp>Storage</samp> is a global type, built in to Flow, but flow-runtime itself doesn't know anything about it - if you compile this code, flow-runtime will emit a warning about being unable to resolve a type called "Storage".</p>
              <p>A possible solution to this would be to include all the type definitions which come with Flow as part of flow-runtime, but this is wasteful - the file would be very large and most definitions would go unused.</p>
              <p>To solve this problem, `flow-runtime-cli`:</p>
              <ol>
                <li>Crawls your project source code looking for these types.</li>
                <li>Discovers the matching type definitions in `flow-typed` or wherever specified by your `.flowconfig` file.</li>
                <li>Creates a graph of dependencies and generates the code for only the types you use, this produces a file that looks like this:</li>
              </ol>
              <CodeMirror value={outputExample} readOnly />
              <br /><br />
              <p>You can then import this file once, in your entry point, and flow-runtime will be able to validates values of this type.</p>
              <hr />
              <h4>Installation</h4>
              <InstallInstruction devPackageNames={['flow-runtime-cli']} />
              <hr />
              <h4>Usage</h4>

              <p>If your source files are in a folder called <samp>src</samp>, run:</p>

              <pre>{`flow-runtime generate ./src > ./src/typedefs.js`}</pre>

              <p>then, in your entry point (e.g. <samp>index.js</samp>) your first import should be:</p>
              <pre>{`import './typedefs';`}</pre>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

