# flow-runtime-validators

Common validators for use with [flow-runtime](https://codemix.github.io/flow-runtime).


## Installation

```
npm install flow-runtime-validators
```
or
```
yarn add flow-runtime-validators
```


## Usage

```js
import t from 'flow-runtime';
import {validators, compose} from 'flow-runtime-validators';

type EmailAddress = string;

EmailAddress.addConstraint(compose(
  validators.length({max: 250}),
  validators.email()
));

EmailAddress.assert("foo@example.com"); // ok
EmailAddress.assert("nope.com"); // throws
```
