/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';

import Example from '../Example';

const refWithFlowErrorCode = `
type User = {name: string};
console.log(User.toString(true)); // Flow Error
`.trim();

const flowError = `
3: console.log(User.toString(true)); // Flow Error
               ^ User. type referenced from value position
2: type User = {name: string};
        ^ type User
`;


const reifyCode = `
import t, {reify} from 'flow-runtime';
import type {Type} from 'flow-runtime';

type User = {name: string};

const UserType = (reify: Type<User>);

console.log(UserType.toString(true)); // No errors

// you can also use it inline in an expression
console.log((reify: Type<User>).getProperty('name').unwrap().toString());
`.trim();

@observer
export default class WorkingWithFlowPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <div className="container">
            <h1>Working with Flow</h1>
          </div>
        </header>
        <div className="container">
          <h4>Referencing Types as Values</h4>
          <p>babel-plugin-flow-runtime turns flow type definitions into normal variable declarations, which means you can pass their values around just like any other. A problem with this though is that as far as Flow is concerned types are not visible at runtime, and so referencing them produces a Flow error, e.g.</p>
          <Example code={refWithFlowErrorCode}
                   outputTitle={<p>Compiles to:</p>}
                   inline
          />
          <p>While this code actually works with babel-plugin-flow-runtime, Flow itself will complain with:</p>
          <pre>{flowError}</pre>
          <p>This is clearly unacceptable if the goal of flow-runtime is be completely compatible with Flow. We get around this problem by using a special transformation:</p>
          <p><strong>reify</strong></p>
          <p><samp>reify</samp> is a special value, exported by flow-runtime, which can be cast to any type using Flow. It's actually not a value at all, it's undefined, but we can turn it into a value of the right type by leveraging Flow's typecasting features and special casing <code>reify</code> in the babel plugin:</p>
          <Example code={reifyCode}
                   outputTitle={<p>Compiles to:</p>}
                   inline
          />
          <p>Now <code>UserType</code> can be safely referenced like any other object, and Flow knows that it is a <code>{'Type<User>'}</code>.</p>
        </div>
      </div>
    );
  }
}

