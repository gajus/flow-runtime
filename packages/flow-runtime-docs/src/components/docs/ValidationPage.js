/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';
import Example from '../Example';

const validationCode = `
import t from 'flow-runtime';

const string = t.string();

const validation = t.validate(string, false);

validation.hasErrors(); // true
console.log(validation.errors); // array
`.trim();


const reportingCode = `
import t from 'flow-runtime';

const string = t.string();

const validation = t.validate(string, false);
if (validation.hasErrors()) {
  const json = t.makeJSONError(validation);
  console.log(JSON.stringify(json, null, 2));

  const error = t.makeTypeError(validation);
  throw error;
}

`.trim();

@observer
export default class ValidationPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <h1>Validation & Error Reporting</h1>
        </header>
        <div className="container">
          <h4>Validation</h4>
          <p>Sometimes it's useful to get the full details of why a particular value does not match a type.</p>

          <p>In addition to <code>t.any().accepts(value)</code> and <code>t.any().assert(value)</code>, the <Link to="/docs/type-context">TypeContext</Link> exposes a <code>t.validate(t.any(), value)</code> method which returns a <code>Validation</code> object:</p>
          <Example code={validationCode}
                   inline
                   hideOutput
          />
          <hr />
          <h4>Error Reporting</h4>
          <p><code>Validation</code> objects are the raw representation of the validation result, we use Error Reporters to turn them into something more useful:</p>
          <Example code={reportingCode}
                   inline
                   hideOutput
          />
        </div>
      </div>
    );
  }
}

