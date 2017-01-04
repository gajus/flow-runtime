# Flow Runtime

A runtime type system for JavaScript with full [Flow](https://flowtype.org/) compatibility.


## What?

Provides a rich API for defining, inspecting and verifying data types in JavaScript. Any value that can be represented in JS can be represented by `flow-runtime`, including full support for polymorphism and parameterized types.


[See the docs for more information](https://codemix.github.io/flow-runtime/#/docs).

## Usage

```js
import t from 'flow-runtime';

const number = t.number();
const string = t.string();

string.accepts('foo'); // true
string.accepts(123); // false
number.accepts(123); // true

string.assert('Hello World!'); // ok
string.assert(false); // throws
number.assert(456); // ok
number.assert('nope'); // throws

const numberOrString = t.union(number, string);

numberOrString.assert(123); // ok
numberOrString.assert("baz"); // ok
numberOrString.assert(false); // throws

const fooOrBar = t.union(
  t.string('foo'),
  t.string('bar')
);

fooOrBar.assert('foo'); // ok
fooOrBar.assert('bar'); // ok
fooOrBar.assert('qux'); // throws

const Thing = t.object(
  t.property('name', t.string()),
  t.property('url', t.nullable(t.string()))
);

Thing.assert({
  name: 'Example',
  url: 'http://example.com/'
}); // OK


Thing.assert({
  name: 'Example'
}); // OK

Thing.assert({
  name: false
}); // throws

const arrayOfStrings = t.array(t.string());

arrayOfStrings.assert()

// ---------------------------------------------

const UserStatus = t.union(
  t.string('PENDING'),
  t.string('ACTIVE'),
  t.string('INACTIVE')
);

const PreferenceName = t.union(
  t.string('marketingOptIn'),
  t.string('darkColourScheme')
);

const UserPreferences = t.object(
  t.indexer(PreferenceName, t.boolean())
);

const User = t.object({
  id: t.number(),
  name: t.string(),
  email: t.string(),
  status: UserStatus,
  preferences: UserPreferences
});

const validUser = {
  id: 123,
  name: 'Sally',
  email: 'sally@example.com',
  status: 'PENDING',
  preferences: {
    marketingOptIn: true
  }
};

const invalidUser = {
  id: false, // invalid
  name: 'Bob',
  email: 'bob@example.com',
  status: 'NOPE', // invalid
  preferences: {
    marketingOptIn: true,
    nope: true // invalid
  }
};

User.accepts(validUser); // true
User.accepts(invalidUser); // false

User.assert(validUser); // OK
User.assert(invalidUser); // throws TypeError

```