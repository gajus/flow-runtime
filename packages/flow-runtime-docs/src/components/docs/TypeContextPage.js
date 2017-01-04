/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';

import Example from '../Example';

const simpleCode = `
import t, {TypeContext} from 'flow-runtime';

console.log(t instanceof TypeContext);

t.declare("Foo", t.string());
t.declare("Bar", t.boolean());

const child = t.createContext();

console.log(child instanceof TypeContext);
child.declare("Foo", t.number());

t.ref("Foo").assert("hello world");
child.ref("Foo").assert(123);
child.ref("Bar").assert(true);
child.ref("Foo").assert("hello world"); // throws
`.trim();


const declareCode = `
import t from 'flow-runtime';

t.declare('User', t.object({
  id: t.number(),
  name: t.string(),
  email: t.string(),
}));

// "User" can now be used throughout the application.

const User = t.ref('User');
User.assert({
  id: false,
  name: true
});
`.trim();

@observer
export default class TypeContextPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <h1>Type Context</h1>
        </header>
        <div className="container">
          <h4>Type Contexts</h4>
          <p>
            Type contexts represent the "scopes" that types are defined under.
            Types always belong to a particular context, and each context can have any number of child contexts.
            In most cases using the global context (the one exported by default when you <code>import t from 'flow-runtime'</code>) is most appropriate, but you can create sub-contexts with <code>t.createContext()</code>:</p>
          <Example code={simpleCode}
                   inline
                   hideOutput
          />
          <hr />
          <h4>Declaring Types</h4>
          <p>Types can be registered in a particular context using <code>t.declare()</code>.</p>
          <Example code={declareCode}
                   hideOutput
                   inline
          />
        </div>
      </div>
    );
  }
}

