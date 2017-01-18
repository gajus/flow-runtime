/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';
import Example from '../Example';

const simplePatternCode = `
import t from 'flow-runtime';

const makeUpperCase = t.pattern(
  (input: string) => input.toUpperCase(),
  (input: number) => input
);

console.log(makeUpperCase("foo bar"));
console.log(makeUpperCase(123));
console.log(makeUpperCase(false)); // throws
`.trim();



const deoptPatternCode = `
import t from 'flow-runtime';

const a = (input: string) => input.toUpperCase();
const b = (input: number) => input;

const makeUpperCase = t.pattern(a, b);

console.log(makeUpperCase("foo bar"));
console.log(makeUpperCase(123));
console.log(makeUpperCase(false)); // throws
`.trim();

const addPatternCode = `
import t from 'flow-runtime';

const concat = t.pattern(
  (a: string, b: string) => a + b,
  (a: number, b: number) => String(a) + String(b),
  (a: string, b: number) => a + String(b),
  (a: number, b: string) => String(a) + b
);

console.log(concat("foo", "bar"));
console.log(concat(12, 3));
console.log(concat(45, "6"));
console.log(concat("78", 9));
console.log(concat(true, false)); // throws
`.trim();

const defaultPatternCode = `
import t from 'flow-runtime';

const makeUpperCase = t.pattern(
  (input: "") => "[UNKNOWN]",
  (input: string) => input.toUpperCase(),
  (input: boolean) => input ? "YES" : "NO",
  _ => _ // default clause
);

console.log(makeUpperCase(""));
console.log(makeUpperCase("foo bar"));
console.log(makeUpperCase(true));
console.log(makeUpperCase(false));
console.log(makeUpperCase(123));
console.log(makeUpperCase(["this is fine"])); // ["this is fine"]
`.trim();


const reactComponentCode = `
import t from "flow-runtime";
import React from "react";

type OnePerson = {name: string};
type ManyPeople = {names: string[]};

const Greet = t.pattern(
  ({name}: OnePerson) => <h1>Hello {name}</h1>,
  ({names}: ManyPeople) => <h1>Hello {names.join(" and ")}</h1>,
  _ => <h1>No one to greet 😢</h1>
);

return (
  <div>
    <Greet name="Sally" />
    <hr />
    <Greet names={["Bob", "Alice"]} />
    <hr />
    <Greet />
  </div>
);
`.trim();

const matchCode = `
import t from 'flow-runtime';

console.log(t.match("foo", [
  (input: string) => input.toUpperCase(),
  (input: number) => input
]));

`.trim();

const multiMatchCode = `
import t from 'flow-runtime';

console.log(t.match("foo", "bar", [
  (a: string, b: string) => (a + b).toUpperCase(),
  (input: number) => input
]));

`.trim();

@observer
export default class PatternMatchingPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <div className="container">
            <h1>Pattern Matching</h1>
            <p className="lead">Pattern Matching lets you replace complicated <code>if...else</code> statements with a simple declarative alternative based on types.</p>
          </div>
        </header>
        <div className="container">
          <h4>t.pattern(...clauses)</h4>
          <p>Creates a pattern which can match input based on the given <code>clauses</code>.</p>
          <p>Each argument is a function with a type signature, apart from optionally the last function in the list, which can have untyped parameters to represent the default clause.</p>
          <p>The returned pattern will dispatch input based on the first matching function. If no function matches (and therefore no default clause was specified), it will throw a <code>RuntimeTypeError</code>.</p>
          <p><Link to="/babel-plugin-flow-runtime">babel-plugin-flow-runtime</Link> is able to optimize calls to <code>t.pattern()</code> in many cases, for example:</p>
          <Example code={simplePatternCode}
                   inline
                   outputTitle={<p>Compiles to:</p>}
          />
          <p>But this only works when the clauses are specified in-line:</p>
          <Example code={deoptPatternCode}
                   inline
                   outputTitle={<p>Falls back to the slightly slower version:</p>}
          />
          <p>Patterns can have multiple arguments:</p>
          <Example code={addPatternCode}
                   inline
                   hideOutput
          />
          <p>And can specify a default clause by using an unannotated function:</p>
          <Example code={defaultPatternCode}
                   inline
                   hideOutput
          />
          <hr />
          <h4>Pattern Matching & React</h4>
          <p><code>t.pattern()</code> works especially well when combined with React components:</p>
          <Example code={reactComponentCode}
                   inline
                   hideOutput
          />
          <hr />
          <h4>t.match(...input: any[], clauses: Function[])</h4>
          <p><code>t.match()</code> is similar to <code>t.pattern()</code> except that rather than returning a function to use later it performs the operation immediately and returns the matching value (or throws if none is specified)</p>
          <p>The last argument must contain an array of clauses to pass to <code>t.pattern()</code>:</p>
          <Example code={matchCode}
                   inline
                   outputTitle={<p>Compiles to:</p>}
          />
          <p>Multiple arguments are supported, just as with <code>t.pattern()</code></p>
          <Example code={multiMatchCode}
                   inline
                   outputTitle={<p>Compiles to:</p>}
          />
        </div>
      </div>
    );
  }
}

