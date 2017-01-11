/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';
import Example from '../Example';

const simpleConstraintCode = `
// constraints are just simple functions.

const mustBeUpperCase = (input) => {
  if (input.toUpperCase() !== input) {
    return 'must be upper case!';
  }
};

console.log(mustBeUpperCase('OK')); // undefined
console.log(mustBeUpperCase('nope')); // 'must be upper case!'
`.trim();


const refinementCode = `
import t from 'flow-runtime';

const mustBeUpperCase = (input) => {
  if (input.toUpperCase() !== input) {
    return 'must be upper case!';
  }
};

const UpperStringType = t.refinement(t.string(), mustBeUpperCase);

console.log(UpperStringType.assert('OK'));
console.log(UpperStringType.assert('nope'));
`.trim();


const addConstraintCode = `
import t, {reify} from 'flow-runtime';
import type {Type} from 'flow-runtime';

// this is the type we're going to augment
type NotEmptyString = string;

// The following keeps flow happy, you could just use NotEmptyString directly.
const NotEmptyStringType = (reify: Type<NotEmptyString>);

NotEmptyStringType.addConstraint((input: string) => {
  if (input.length === 0) {
    return 'cannot be empty';
  }
});

console.log('validating ""', NotEmptyStringType.accepts(''));
console.log('validating "abc"', NotEmptyStringType.accepts('abc'));
console.log('validating 123', NotEmptyStringType.accepts(123));

// assertions

('ok': NotEmptyString);
('': NotEmptyString); // throws
`.trim();


const objectsCode = `
import t, {reify} from 'flow-runtime';
import type {Type} from 'flow-runtime';

type User = {
  username: string;
  email: string;
};

const UserType = (reify: Type<User>);

UserType.getProperty('username').addConstraint(
  (input) => {
    if (input.length < 3) {
      return 'too short';
    }
    else if (input.length > 16) {
      return 'too long';
    }
  }
);

UserType.getProperty('email').addConstraint((input) => {
  if (!/@/.test(input)) {
    return 'must be a valid email address';
  }
});

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
    console.log('✅ valid')
  }
  catch (e) {
    console.error(e.message);
  }
  console.log('---------------------------------------');
});

`.trim();

@observer
export default class TypeRefinementsPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <div className="container">
            <h1>Type Refinements</h1>
            <p className="lead">Type Refinements are used to "narrow" types to make them stricter, they can be used to ensure that a given number is an integer or that a string is a valid email address, or passes any other arbitrary condition.</p>
          </div>
        </header>
        <div className="container">
          <h4>Constraints</h4>
          <p>Constraints are functions which take some input and either return nothing at all (<code>undefined</code>) if the input is valid, or a string with the error message if it's invalid.</p>
          <p>All Type Refinements are based on constraint functions.</p>
          <Example code={simpleConstraintCode}
                   inline
                   hideOutput
          />
          <p>See <Link to="/flow-runtime-validators">flow-runtime-validators</Link> for a collection of common reusable constraints.</p>
          <hr />
          <h4>.addConstraint()</h4>
          <p>Type Aliases, Type Declarations, Var Declarations and Object Properties can all be augmented with constraints with <code>.addConstraint()</code>.</p>
          <p>This modifies the existing type to restrict the subset of values it will permit. It's often necessary to use <code>.addConstraint()</code> instead of <code>t.refinement()</code> to allow Flow to keep reference to the original type.</p>

          <Example code={addConstraintCode}
                   inline
                   hideOutput
          />
          <p>Or with objects:</p>
          <Example code={objectsCode}
                   inline
                   hideOutput
          />
          <hr />
          <h4>t.refinement(existingType, ...constraints)</h4>
          <p>Takes an existing type and returns a new type with the given constraints applied, leaving the original type intact.</p>
          <Example code={refinementCode}
                   inline
                   hideOutput
          />
        </div>
      </div>
    );
  }
}

