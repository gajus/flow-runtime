# Babel Plugin Flow Prepack

A babel plugin which transforms [Flow](https://flowtype.org/) annotations into [prepack](https://prepack.io/) model declarations.

## What?

Turns code like this:

```js

type Status = string;

declare var someGlobal: {
  foo: number,
  bar: string,
  status: Status
};

```

Into code like this:

```js
const Status = 'string';
__assumeDataProperty(global, 'someGlobal', __abstract({
  foo: __abstract('number'),
  bar: __abstract('string'),
  status: __abstract(Status)
}))
```

So that you can use Flow type annotations to give type hints to prepack.


## Installation


```sh
npm install --save-dev babel-plugin-flow-prepack
```

Next, add the following to your babel configuration or `.babelrc`:

```json
{
  "plugins": ["flow-prepack"]
}
```
