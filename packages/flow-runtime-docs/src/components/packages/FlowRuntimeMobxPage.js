/* @flow */
import React, { Component } from 'react';
import {observer} from 'mobx-react';

import InstallInstruction from '../InstallInstruction';
import Example from '../Example';

// eslint-disable-next-line

const setupExample = `
import t from 'flow-runtime';
import * as mobx from 'mobx';
import flowRuntimeMobx from 'flow-runtime-mobx';

flowRuntimeMobx(t, mobx); // only need to do this once.
`.trim();

const simpleExample = `
import {observable, ObservableMap} from 'mobx';

type Thing = {
  numbers: number[];
  map: Map<string, string>;
};

const thing: Thing = observable({
  numbers: [1, 2, 3],
  map: new ObservableMap({foo: 'bar'})
});

console.log(thing);
`.trim();

@observer
export default class FlowRuntimeMobxPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <div className="container">
            <h1>flow-runtime-mobx</h1>
              <p className="lead">
                Adds mobx support to flow-runtime.
            </p>
            <a href="https://github.com/codemix/flow-runtime/tree/master/packages/flow-runtime-mobx" className="btn btn-primary">
              <i className="fab fa-github" />
              {' '}
              flow-runtime-mobx on github
            </a>
          </div>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-sm-10 offset-sm-1">
              <h4>Why?</h4>
              <p>Because mobx observables don't pass standard checks like <code>Array.isArray(observableArray)</code> or <code>observableMap instanceof Map</code>. This module makes flow-runtime aware of mobx observables so that it treats them like their native equivalents.</p>
              <hr />
              <h4>Installation</h4>
              <InstallInstruction packageNames={['flow-runtime-mobx']} />
              <hr />
              <h4>Usage</h4>
              <Example code={setupExample} inline hideOutput inputTitle={<p>Pass the flow-runtime library and mobx into <code>flowRuntimeMobx()</code>:</p>}/>
              <Example code={simpleExample} inline hideOutput inputTitle={<p>You can now use <code>ObservableMap</code> and <code>ObservableArray</code> in place of their native equivalents:</p>}/>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

