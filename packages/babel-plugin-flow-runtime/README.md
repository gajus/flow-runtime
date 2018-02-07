# Babel Plugin Flow Runtime

A babel plugin which transforms [Flow](https://flowtype.org/) annotations into `Type` instances available at runtime, and optionally checks values against those types.

Supports all of flow's syntax, aims for full compatibilty with flow, found a bug? Please [report it](https://github.com/codemix/flow-runtime/issues).


## What?

Turns code like this:

```js
type User = {
  id: number;
  name: string;
};
```

Into code like this:

```js
import t from 'flow-runtime';
const User = t.type('User', t.object(
  t.property('id', t.number()),
  t.property('name', t.string())
));
```

Which you can then use like this:

```js
User.assert({id: 123, name: 'Sally'}); // ok
User.assert({id: false, name: 'Bob'}); // throws
```


## Installation

This plugin has a runtime dependency on [flow-runtime](https://github.com/codemix/flow-runtime/tree/master/packages/flow-runtime), so make sure you install that along with this package:

```sh
npm install --save-dev babel-plugin-flow-runtime
npm install --save flow-runtime
```

Next, add the following to your babel configuration or `.babelrc`:

```json
{
  "plugins": [["flow-runtime", {
    "assert": true,
    "annotate": true
  }]]
}
```

## Options

The plugin supports the following options:

- `assert` - Boolean, indicates whether types should be asserted at runtime. Defaults to `true` if `process.env.NODE_ENV === 'development'`, otherwise `false`.
- `annotate` - Boolean, indicates whether object or function values that have type annotations should be decorated with those types at runtime. Defaults to `true`.
- `libraryName` - String, indicates which runtime to use. Defaults to `flow-runtime`


If `assert` is `true`, the following code:
```js
const add = (a: number, b: number): number => a + b;
```
will be transformed into:
```js
import t from 'flow-runtime';
const add = (a, b) => {
  let _aType = t.number();
  let _bType = t.number();
  const _returnType = t.return(t.number());
  t.param('a', _aType).assert(a);
  t.param('b', _bType).assert(b);
  return _returnType.assert(a + b);
};
```

Which is very safe, and can be very useful during development, but has a non-trivial performance overhead. It's usually a good idea to disable this feature in production.


If `annotate` is `true`, the following:
```js
const add = (a: number, b: number): number => a + b;
```
will be transformed into:
```js
import t from 'flow-runtime';
const add = t.annotate(
  (a, b) => a + b,
  t.function(
    t.param('a', t.number()),
    t.param('b', t.number()),
    t.return(t.number())
  )
);
```

Now invoking `add(x, y)` does not incur any overhead, as the parameters are not checked, but the type information is preserved and available for inspection:
```js
console.log(String(t.typeOf(add))); // (a: number, b: number) => number
```

If both `assert` and `annotate` are `false` then value annotations are ignored, but type aliases are still transformed:
```js
type User = {
  id: number;
  name: string;
};
```
turns into:
```js
import t from 'flow-runtime';
const User = t.type('User', t.object(
  t.property('id', t.number()),
  t.property('name', t.string())
));
```

## React Prop Types

When the plugin encounters a React component with a `props` type annotation, the annotation is converted to react prop types:

```js
import React from 'react';

type Props = {
  name: string;
};

export class App extends React.Component<void, Props, void> {
  render () {
    return <h1>{this.props.name}</h1>;
  }
}
```

Becomes

```js
import t from 'flow-runtime';
import React from 'react';

const Props = t.type('Props', t.object(
  t.property('name', t.string())
));

export class App extends React.Component {
  static propTypes = t.propTypes(Props);
  render () {
    return <h1>{this.props.name}</h1>;
  }
}
```
