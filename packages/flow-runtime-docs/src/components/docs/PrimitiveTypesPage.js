/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Link, IndexLink} from 'react-router';

import Example from '../Example';

const nullCode = `
import t from 'flow-runtime';

console.log(t.null().assert(null)); // ok
t.null().assert(undefined); // throws
t.null().assert(false); // throws
`.trim();


const voidCode = `
import t from 'flow-runtime';

console.log(t.void().assert(undefined)); // ok
t.void().assert(null); // throws
t.void().assert(false); // throws
`.trim();

const numberCode = `
import t from 'flow-runtime';

console.log(t.number().assert(123)); // ok
t.number().assert("456"); // throws
t.number().assert(null); // throws
`.trim();

const numberExactCode = `
import t from 'flow-runtime';

console.log(t.number(123).assert(123)); // ok
t.number(123).assert(123.456); // throws
t.number(123).assert(456); // throws
t.number(123).assert("123"); // throws
`.trim();


const booleanCode = `
import t from 'flow-runtime';

console.log(t.boolean().assert(true)); // ok
console.log(t.boolean().assert(false)); // ok
t.boolean().assert("456"); // throws
t.boolean().assert(null); // throws
`.trim();

const booleanExactCode = `
import t from 'flow-runtime';

console.log(t.boolean(true).assert(true)); // ok
t.boolean(true).assert(false); // throws
t.boolean(true).assert(456); // throws
t.boolean(true).assert("true"); // throws
`.trim();


const stringCode = `
import t from 'flow-runtime';

console.log(t.string().assert("foo")); // ok
t.string().assert(123); // throws
t.string().assert(null); // throws
`.trim();

const stringExactCode = `
import t from 'flow-runtime';

console.log(t.string("foo").assert("foo")); // ok
t.string("foo").assert("foobar"); // throws
t.string("foo").assert(false); // throws
`.trim();


const symbolCode = `
import t from 'flow-runtime';

console.log(t.symbol().assert(Symbol.for('test'))); // ok
t.symbol().assert("foobar"); // throws
t.symbol().assert(null); // throws
`.trim();

const symbolExactCode = `
import t from 'flow-runtime';

console.log(t.symbol(Symbol.for('test')).assert(Symbol.for('test'))); // ok
t.symbol(Symbol.for('test')).assert(Symbol('nope')); // throws
t.symbol(Symbol.for('test')).assert(456); // throws
t.symbol(Symbol.for('test')).assert("123"); // throws
`.trim();



const anyCode = `
import t from 'flow-runtime';

console.log(t.any().assert("foobar")); // ok
console.log(t.any().assert(null)); // ok
`.trim();


const mixedCode = `
import t from 'flow-runtime';

console.log(t.mixed().assert("foobar")); // ok
console.log(t.mixed().assert(null)); // ok
`.trim();


const nullableCode = `
import t from 'flow-runtime';

console.log(t.nullable(t.string()).assert("foobar")); // ok
console.log(t.nullable(t.string()).assert()); // ok
console.log(t.nullable(t.string()).assert(undefined)); // ok
console.log(t.nullable(t.string()).assert(null)); // ok
console.log(t.nullable(t.string()).assert(123)); // throws
`.trim();


@observer
export default class PrimitiveTypesPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <h1>Primitive Types</h1>
        </header>
        <div className="container">

          <h4>t.null()</h4>
          <p><code>t.null()</code> matches exactly <code>null</code> and nothing else:</p>
          <Example code={nullCode} hideOutput inline/>
          <hr />
          <h4>t.void()</h4>
          <p><code>t.void()</code> matches exactly <code>undefined</code> and nothing else:</p>
          <Example code={voidCode} hideOutput inline/>
          <hr />
          <h4>t.number()</h4>
          <p><code>t.number()</code> matches any kind of number.</p>
          <Example code={numberCode} hideOutput inline/>
          <hr />
          <h4>t.number(123)</h4>
          <p><code>t.number(123)</code> matches a number with the exact value of <code>123</code>.</p>
          <Example code={numberExactCode} hideOutput inline/>
          <hr />
          <h4>t.boolean()</h4>
          <p><code>t.boolean()</code> matches any kind of boolean.</p>
          <Example code={booleanCode} hideOutput inline/>
          <hr />
          <h4>t.boolean(true)</h4>
          <p><code>t.boolean(true)</code> matches a boolean with the exact value of <code>true</code>.</p>
          <Example code={booleanExactCode} hideOutput inline/>
          <hr />
          <h4>t.string()</h4>
          <p><code>t.string()</code> matches any kind of string.</p>
          <Example code={stringCode} hideOutput inline/>
          <hr />
          <h4>t.string("foo")</h4>
          <p><code>t.string("foo")</code> matches a string with the exact value of <code>"foo"</code>.</p>
          <Example code={stringExactCode} hideOutput inline/>
          <hr />
          <h4>t.symbol()</h4>
          <p><code>t.symbol()</code> matches any kind of symbol.</p>
          <Example code={symbolCode} hideOutput inline/>
          <hr />
          <h4>t.symbol(Symbol("abc"))</h4>
          <p><code>t.symbol(Symbol("abc"))</code> matches an exact symbol.</p>
          <Example code={symbolExactCode} hideOutput inline/>
          <hr />
          <h4>t.any()</h4>
          <p><code>t.any()</code> matches any kind of value.</p>
          <Example code={anyCode} hideOutput inline/>
          <hr />
          <h4>t.mixed()</h4>
          <p><code>t.mixed()</code> matches any kind of value.</p>
          <Example code={mixedCode} hideOutput inline/>
          <hr />
          <h4>t.nullable(type)</h4>
          <p><code>t.nullable(type)</code> matches a <code>type</code> but also accepts <code>null</code> or <code>undefined</code>.</p>
          <Example code={nullableCode} hideOutput inline/>
        </div>
      </div>
    );
  }
}

