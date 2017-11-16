/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';

import Example from '../Example';

const inferenceCode = `
import t from 'flow-runtime';

const input = {
  id: 123,
  name: 'Sally',
  addresses: [
    {
      line1: '123 Fake Street',
      isActive: true
    }
  ]
};

const inputType = t.typeOf(input);

console.log(String(inputType));


inputType.getProperty('id').unwrap().assert(456); // ok
inputType.getProperty('name').unwrap().assert(false); // throws
`.trim();

@observer
export default class TypeInferencePage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <h1>Type Inference</h1>
        </header>
        <div className="container">
          <p><code>flow-runtime</code> can infer types from JavaScript values. These types can then be inspected just like any other:</p>
          <Example code={inferenceCode}
                   inline
                   hideOutput
          />
        </div>
      </div>
    );
  }
}

