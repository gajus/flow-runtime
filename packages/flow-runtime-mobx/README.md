# flow-runtime-mobx

Adds mobx support to [flow-runtime](https://codemix.github.io/flow-runtime).

## Why?
Because mobx observables don't pass standard checks like `Array.isArray(observableArray)` or `observableMap instanceof Map`.

## Installation

```
npm install flow-runtime-mobx
```
or
```
yarn add flow-runtime-mobx
```


## Usage

Before you use any observable objects you must register the types:
```js
import t from 'flow-runtime';
import * as mobx from 'mobx';
import flowRuntimeMobx from 'flow-runtime-mobx';

flowRuntimeMobx(t, mobx); // only need to do this once.
```

You are now free to use `ObservableArray` and `ObservableMap` in place of their native
equivalents thoughout your app:

```js
import {observable, ObservableMap} from 'mobx';

type Thing = {
  numbers: number[];
  map: Map<string, string>;
};

const thing: Thing = observable({
  numbers: [1, 2, 3],
  map: new ObservableMap({foo: 'bar'})
});

console.log(thing);
```