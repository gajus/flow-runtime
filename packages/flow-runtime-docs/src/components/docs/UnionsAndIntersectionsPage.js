/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';

import Example from '../Example';

const unionCode = `
type Status = 'ACTIVE' | 'INACTIVE';

console.log(('ACTIVE': Status)); // ok
console.log(('INACTIVE': Status)); // ok
console.log((false: Status)); // throws
console.log(('nope': Status)); // throws
`.trim();


const intersectCode = `
type Named = {name: string};
type Linkable = {url: string};

type Thing = Named & Linkable;

console.log(({name: 'Widget', url: 'http://example.com/'}): Thing); // ok
console.log(({name: 'Widget'}): Thing); // throws
console.log(({url: 'http://example.com/'}): Thing); // throws
console.log(({name: false, url: 'http://example.com/'}): Thing); // throws
`.trim();

@observer
export default class UnionsAndIntersectionsPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <div className="container">
            <h1>Unions & Intersections</h1>
          </div>
        </header>
        <div className="container">
          <h4>Unions</h4>
          <p>Unions define a number of possible types for a value, and the value must match one of those types</p>
          <Example code={unionCode}
                   inline
                   outputTitle={<p>Compiles into:</p>}
          />
          <hr />
          <h4>Intersections</h4>
          <p>Intersections match every defined type:</p>
          <Example code={intersectCode}
                   outputTitle={<p>Compiles into:</p>}
                   inline
          />
        </div>
      </div>
    );
  }
}

