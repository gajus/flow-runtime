/* @flow */

import React, { Component } from 'react';
import {Link} from 'react-router';
import {observer} from 'mobx-react';

import Example from '../Example';

const suppressTypesCode = `
type Demo = 123;

let oneTwoThree: Demo = 123;

(oneTwoThree: $FlowFixMe);

oneTwoThree = 456;
console.log(123, '=', oneTwoThree);
`.trim();


const suppressCommentsCode = `
const demo = (a: string): string => a;

// $FlowFixMe no type checks for the following line
const demo2 = (a: string): string => a;

// this is type checked again.
const demo3 = (a: string): string => a;

console.log(demo("this is type checked"));
console.log(demo2("this is not type checked"));
console.log(demo2(false));
console.log(demo2(123));
console.log(demo3("this is type checked"));
`.trim();

@observer
export default class PragmasPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <div className="container">
            <h1>Pragmas & Suppressing Type Errors</h1>
          </div>
        </header>
        <div className="container">
          <h4>Pragmas</h4>
          <p>Sometimes it's useful to override <Link to="/babel-plugin-flow-runtime">babel-plugin-flow-runtime</Link>'s transformations on a per-file basis. Perhaps you want to turn off type checking in production for most files but leave it on for your most critical code. For this we use pragmas.</p>
          <p>Note: Pragmas are totally optional, it's better to specify options at the plugin level if you can.</p>
          <p>Pragmas are simple comments that should appear at the top level of your file, they look like this:</p>
          <pre>// @flow-runtime</pre>
          <p>or this:</p>
          <pre>/* @flow-runtime */</pre>
          <p>When used with Flow, they should appear <em>after</em> Flow's own special comment:</p>
          <pre>{'// @flow\n// @flow-runtime'}</pre>
          <p>The behaviour of the plugin changes depending on the options you specify at the end of the comment:</p>
          <p><code>{'/* @flow-runtime */'}</code>: no options is the equivalent of specifying <code>{'/* @flow-runtime assert, annotate */'}</code>.</p>
          <p><code>{'/* @flow-runtime ignore */'}</code>: ignore the whole file, don't process it at all, no assertions or type transformations.</p>
          <p><code>{'/* @flow-runtime assert */'}</code>: any type error in the file will throw an exception.</p>
          <p><code>{'/* @flow-runtime warn */'}</code>: turns type errors into warnings rather than exceptions.</p>
          <p><code>{'/* @flow-runtime annotate */'}</code>: functions and classes will be decorated with type annotations.</p>
          <br />
          <p>You can also specify multiple options at once:</p>
          <p><code>{'/* @flow-runtime warn, annotate */'}</code>: type errors will produce warnings, functions and classes will be decorated with type annotations.</p>
          <hr />
          <h4>Suppressing Individual Type Errors</h4>
          <p>Sometimes you need an escape hatch for code you know to be correct, but which doesn't type check for some reason.</p>
          <p><strong>suppressComments</strong></p>
          <p>You can specify an array of regular expressions that match comments which should ignore type errors. Accepts either strings or <code>RegExp</code>s.</p>
          <p>The only predefined pattern is <code>{'/\\$FlowFixMe/'}</code>:</p>
          <Example code={suppressCommentsCode}
                   outputTitle={<p>Compiles into the following:</p>}
                   inline
          />
          <p><strong>suppressTypes</strong></p>
          <p>An array of type names (strings, not regular expressions) that should suppress type errors:</p>
          <Example code={suppressTypesCode}
                   outputTitle={<p>Compiles into the following:</p>}
                   inline
          />
        </div>
      </div>
    );
  }
}

