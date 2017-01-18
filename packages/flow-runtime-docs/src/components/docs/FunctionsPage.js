/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';

import Example from '../Example';

const simpleCode = `
import t from 'flow-runtime';
const Adder = t.function(
  t.param('a', t.number()),
  t.param('b', t.number()),
  t.return(t.number())
);
console.log(Adder.assert((a, b) => 'wat?')); // does not throw, even though the return value is wrong.
console.log(Adder.assert(a => 123)); // does not throw, but the signature is wrong.

console.log(Adder.assert({nope: true})); // throws because object is not a function.
`.trim();

const annotatedCode = `
import t from 'flow-runtime';
const Adder = t.function(
  t.param('a', t.number()),
  t.param('b', t.number()),
  t.return(t.number())
);

const add = t.annotate(
  (a, b) => a + b,
  Adder
);

const bad = t.annotate(
  (a, b) => "wat",
  t.function(
    t.param('a', t.string()),
    t.param('b', t.string()),
    t.return(t.string())
  )
);

console.log(Adder.assert(add)); // ok
console.log(Adder.assert(bad)); // throws
`.trim();

@observer
export default class FunctionsPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <h1>Functions</h1>
        </header>
        <div className="container">
          <p>Function types can be expressed using <code>t.function()</code></p>
          <p>However, validation for functions is a little trickier. If a function is not annotated, there is no way for us to inspect the arguments or return value without running it, which is unacceptable.</p>
          <p>For that reason, function type validation is quite permissive for non-annotated functions:</p>
          <Example code={simpleCode} hideOutput inline/>
          <p>We solve this problem using <code>t.annotate()</code>:</p>
          <Example code={annotatedCode} hideOutput inline/>

          <hr />
        </div>
      </div>
    );
  }
}

