/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';

import Example from '../Example';

const simpleCode = `
import t from 'flow-runtime';

const AnyArray = t.array(); // same as t.array(t.any())

AnyArray.assert([]); // ok
AnyArray.assert([1, 'foo', true]); // ok
AnyArray.assert(false); // throws
`.trim();


const typedArrayCode = `
import t from 'flow-runtime';

const StringArray = t.array(t.string());

StringArray.assert([]); // ok
StringArray.assert(["foo", "bar"]); // ok
StringArray.assert(["foo", 123]); // throws
StringArray.assert("nope"); // throws
`.trim();

const tupleCode = `
const KeyValue = t.tuple(t.number(), t.string());

KeyValue.assert([123, "foo bar"]); // ok
KeyValue.assert([456, "qux", true, false]); // ok, we ignore subsequent values
KeyValue.assert([456]); // throws
KeyValue.assert([false, "qux"]); // throws
KeyValue.assert([123, false]); // throws
`.trim();

@observer
export default class ArraysAndTuplesPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <h1>Array and Tuple Types</h1>
        </header>
        <div className="container">
            <h4>Simple Array</h4>
            <p>The following declares an array type that accepts any value:</p>
            <Example code={simpleCode} hideOutput inline/>
            <hr />
            <h4>Array of a given type</h4>
            <p>The following declares an array type that accepts only strings:</p>
            <Example code={typedArrayCode} hideOutput inline/>
            <hr />
            <h4>Tuples</h4>
            <p>Tuples are arrays of values, with the element at each specific index having an independently defined type:</p>
            <Example code={tupleCode} hideOutput inline/>
        </div>
      </div>
    );
  }
}

