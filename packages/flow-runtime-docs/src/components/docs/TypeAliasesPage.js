/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';

import Example from '../Example';

const simpleCode = `
type User = {name: string};
const bob: User = {name: 'Bob'};
`.trim();


const polymorphicCode = `
type Dict<K: string | number, V: number> = {[key: K]: V};
const dict: Dict = {
  a: 123,
  b: false
};

`.trim();

@observer
export default class TypeAliasesPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <h1>Type Aliases</h1>
        </header>
        <div className="container">
          <h4>Named Types</h4>
          <p>It's often useful to associate a name with a particular type, especially when that type is reused.</p>
          <p>For this <code>flow-runtime</code> has the concept of <code>TypeAlias</code>es, just as flow itself does.</p>
          <Example code={simpleCode}
                   inputTitle={<p>The following flow type alias:</p>}
                   outputTitle={<p>is expressed as:</p>}
                   inline
          />
          <hr />
          <h4>Polymorphic Named Types</h4>
          <p>Type aliases can define <code>TypeParameter</code>s, allowing bounded polymorphism in the same way that flow does:</p>
          <Example code={polymorphicCode}
                   outputTitle={<p>is expressed as:</p>}
                   inline
          />
        </div>
      </div>
    );
  }
}

