/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';

import Example from '../Example';

const simpleClassCode = `
class User {}

type UserClass = Class<User>;

console.log((User: UserClass));
console.log((false: UserClass)); // throws
`.trim();


const keysCode = `
type Obj = {
  a: number;
  b: boolean;
  c: string;
};

type ObjKeys = $Keys<Obj>;

console.log(('a': ObjKeys)); // ok
console.log(('b': ObjKeys)); // ok
console.log(('c': ObjKeys)); // ok
console.log(('z': ObjKeys)); // throws
`.trim();

const shapeCode = `
type Thing = {
  id: number;
  name: string;
};

console.log(({}: $Shape<Thing>)); // ok
console.log(({id: 123}: $Shape<Thing>)); // ok
console.log(({name: 'Sally'}: $Shape<Thing>)); // ok
console.log(({id: 456, name: 'Bob'}: $Shape<Thing>)); // ok
console.log(({id: false, name: true}: $Shape<Thing>)); // throws

`.trim();

@observer
export default class ExoticTypesPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <h1>Exotic Types</h1>
        </header>
        <div className="container">
          <h4>{'Class<T>'}</h4>
          <Example code={simpleClassCode}
                   inline
                   hideOutput
          />
          <hr />
          <h4>{'$Keys<T>'}</h4>
          <Example code={keysCode}
                   hideOutput
                   inline
          />
          <hr />
          <h4>{'$Shape<T>'}</h4>
          <Example code={shapeCode}
                   hideOutput
                   inline
          />
          <hr />
          <p className="text-muted">Note: other exotic types are supported such as <code>$ObjMap</code> and <code>$ObjMapi</code>, docs coming soon.</p>
        </div>
      </div>
    );
  }
}

