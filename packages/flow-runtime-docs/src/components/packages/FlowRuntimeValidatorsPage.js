/* @flow */
import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';

import InstallInstruction from '../InstallInstruction';
import Example from '../Example';


const objectExample = `
import t, {reify} from 'flow-runtime';
import type {Type} from 'flow-runtime';

import * as validators from 'flow-runtime-validators';

type User = {
  username: string;
  email: string;
};

const UserType = (reify: Type<User>);

UserType.getProperty('username').addConstraint(
  validators.length({min: 3, max: 16}),
  validators.regexp({pattern: /^(\\w+)$/, message: 'must be alphanumeric, no spaces.'})
);

UserType.getProperty('email').addConstraint(validators.email());

const demoUsers = [
  {username: 'Sally', email: 'sally@example.com'},
  {username: 'no', email: 'demo@example.com'},
  {username: 'Bob', email: 'nope'},
  {username: false}
];

demoUsers.forEach(item => {
  try {
    console.log('checking user:', item);
    (item: User); // same as UserType.assert(item)
    console.log('✅ Valid.')
  }
  catch (e) {
    console.error(e.message);
  }
  console.log('---------------------------------------');
});
`.trim();

function quick (...code: string[]): string {
  return `
import * as v from 'flow-runtime-validators';

${code.map(expr => `console.log(${expr.trim()});`).join('\n')}
`.trim();
}

@observer
export default class FlowRuntimeValidatorsPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <div className="container">
            <h1>flow-runtime-validators</h1>
              <p className="lead">
                A collection of common validators for use with flow-runtime.
            </p>
            <a href="https://github.com/codemix/flow-runtime-validators/tree/master/packages/flow-runtime-validators" className="btn btn-primary">
              <i className="fa fa-github" />
              {' '}
              flow-runtime-validators on github
            </a>
          </div>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-sm-10 offset-sm-1">
              <h4>Installation</h4>
              <InstallInstruction packageNames={['flow-runtime-validators']} />
              <hr />
              <h4>Usage</h4>
              <p>Each validator is a function which optionally takes an <code>Options</code> object as an argument and returns a <code>TypeConstraint</code> which can be passed to <code>addConstraint()</code>.</p>
              <p>In order to specify a custom error message, pass a <code>message</code> key in the validator options.</p>
              <p>Note: See the <Link to="/docs/type-refinements">type refinements documentation</Link> for more information about using constraints.</p>
              <Example code={objectExample} inline hideOutput />
              <hr />
              <div>
                <h4>number()</h4>
                <p>Validates numbers, supports the following options which may be combined:</p>
                <p><strong>gt</strong> - ensures that the input is greater than the given value:</p>
                <Example code={quick(`v.number({gt: 3})(4)`, `v.number({gt: 3})(3)`)} inline hideOutput />
                <p><strong>gte</strong> - ensures that the input is greater than or equal to the given value:</p>
                <Example code={quick(`v.number({gte: 3})(3)`, `v.number({gte: 3})(4)`, `v.number({gte: 3})(1)`)} inline hideOutput />
                <p><strong>lt</strong> - ensures that the input is less than the given value:</p>
                <Example code={quick(`v.number({lt: 3})(2)`, `v.number({lt: 3})(3)`)} inline hideOutput />
                <p><strong>lte</strong> - ensures that the input is less than or equal to the given value:</p>
                <Example code={quick(`v.number({lte: 3})(3)`, `v.number({lte: 3})(4)`, `v.number({lte: 3})(1)`)} inline hideOutput />
                <p><strong>exact</strong> - ensures that the input is exactly the given value:</p>
                <Example code={quick(`v.number({exact: 3})(3)`, `v.number({exact: 3})(4)`, `v.number({exact: 3})(1)`)} inline hideOutput />
                <p><strong>divisibleBy</strong> - ensures that the input is divisibleBy the given value:</p>
                <Example code={quick(`v.number({divisibleBy: 3})(3)`, `v.number({divisibleBy: 3})(9)`, `v.number({divisibleBy: 3})(10)`)} inline hideOutput />
              </div>
              <hr />
              <div>
                <h4>length()</h4>
                <p>Validates lengths of arrays and strings, supports the following options which may be combined:</p>
                <p><strong>min</strong> - ensures that the input length is at least the given value:</p>
                <Example code={quick(`v.length({min: 3})("yes")`, `v.length({min: 3})("no")`)} inline hideOutput />
                <p><strong>max</strong> - ensures that the input length is at most the given value:</p>
                <Example code={quick(`v.length({max: 3})("ok")`, `v.length({max: 3})("yes")`, `v.length({max: 3})("nope")`)} inline hideOutput />
                <p><strong>exact</strong> - ensures that the input length is at exactly the given value:</p>
                <Example code={quick(`v.length({exact: 3})("no")`, `v.length({exact: 3})("yes")`, `v.length({exact: 3})("nope")`)} inline hideOutput />
              </div>
              <hr />
              <div>
                <h4>regexp()</h4>
                <p>Ensures that the input matches the given regular expression:</p>
                <p><strong>pattern</strong> - the regular expression to match against, can be a regular expression literal or a string.</p>
                <Example code={quick(`v.regexp({pattern: /^([a-z]+)$/})("yes")`, `v.regexp({pattern: "^yes$"})("no")`)} inline hideOutput />
              </div>
              <hr />
              <div>
                <h4>url()</h4>
                <p>Ensures that the input is a valid URL:</p>
                <Example code={quick(`v.url()("http://example.com/")`, `v.url()("nope")`)} inline hideOutput />
              </div>
              <hr />
              <div>
                <h4>email()</h4>
                <p>Ensures that the input is a valid email address:</p>
                <Example code={quick(`v.email()("foo@example.com")`, `v.email()("nope")`)} inline hideOutput />
              </div>
              <hr />
              <div>
                <h4>ipv4()</h4>
                <p>Ensures that the input is a valid ipv4 address:</p>
                <Example code={quick(`v.ipv4()("127.0.0.1")`, `v.ipv4()("nope")`)} inline hideOutput />
              </div>
              <hr />
              <div>
                <h4>hostName()</h4>
                <p>Ensures that the input is a valid hostName address:</p>
                <Example code={quick(`v.hostName()("example.com")`, `v.hostName()("not valid")`)} inline hideOutput />
              </div>
              <hr />
              <div>
                <h4>ipv6()</h4>
                <p>Ensures that the input is a valid ipv6 address:</p>
                <Example code={quick(`v.ipv6()("2001:db8::ff00:42:8329")`, `v.ipv6()("nope not valid")`)} inline hideOutput />
              </div>
              <hr />
              <div>
                <h4>dateTime()</h4>
                <p>Ensures that the input is a valid date / time:</p>
                <Example code={quick(`v.dateTime()("2017-01-01T00:00:01.23Z")`, `v.dateTime()("nope not valid")`)} inline hideOutput />
              </div>
              <hr />
              <div>
                <h4>date()</h4>
                <p>Ensures that the input is a valid date:</p>
                <Example code={quick(`v.date()("2017-01-01")`, `v.date()("nope not valid")`)} inline hideOutput />
              </div>
              <hr />
              <div>
                <h4>time()</h4>
                <p>Ensures that the input is a valid time:</p>
                <Example code={quick(`v.time()("00:00:01")`, `v.time()("nope not valid")`)} inline hideOutput />
              </div>
              <hr />
              <div>
                <h4>color()</h4>
                <p>Ensures that the input is a valid color:</p>
                <Example code={quick(`v.color()("#cccccc")`, `v.color()("red")`, `v.color()("rgb(123,123,123)")`, `v.color()("nope not valid")`)} inline hideOutput />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

