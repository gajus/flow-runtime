# Object Types


## Simple Objects
The simplest objects can be specified as a simple dictionary of key names to types:

```js
import t from 'flow-runtime';

const Thing = t.object({
  name: t.string(),
  url: t.string()
});

Thing.assert({name: 'Widget', url: 'http://example.com/Thing'}); // ok
Thing.assert({name: false}); // throws
```

The definition above could also be written as:

```js
const Thing = t.object(
  t.property('name', t.string()),
  t.property('url', t.string())
);
```

## Optional Properties
`t.property()` takes a third argument, which should be `true` if the given property is optional:

```js
const Thing = t.object(
  t.property('name', t.string()),
  t.property('url', t.string(), true) // url is optional.
);

Thing.assert({name: 'Widget'}); // OK
Thing.assert({name: 'Widget', url: 'http://example.com/'}); // OK
Thing.assert({name: 'Widget', url: false}); // throws
```

## Self-referential Objects
Sometimes object types need to refer to themselves, for example:

```js
const Tree = t.object(Tree => {
  return [
    t.property('value', t.any()),
    t.property('left', Tree, true), // optional
    t.property('right', Tree, true), // optional
  ];
});

const validTree = {
  value: 'hello',
  left: {
    value: 'world',
  }
};

const invalidTree = {
  value: 'hello',
  left: {
    nope: true
  },
  right: false
};

Tree.assert(validTree); // ok
Tree.assert(invalidTree); // throws
```

## Object Indexers
Objects are often used as hashmaps or dictionaries in JavaScript, to indicate the type for the key and value for an object in hash-map mode, we use `t.indexer()`:

```js
const NumberStringDict = t.object(
  t.indexer(t.number(), t.string())
);

NumberStringDict.assert({1: 'foo', 2: 'bar'}); // ok
NumberStringDict.assert({nope: 'foo'}); // throws
NumberStringDict.assert({1: 123}); // throws
```

Objects can have multiple-indexers:

```js
const MultiDict = t.object(
  t.indexer(t.number(), t.string()),
  t.indexer(t.string(), t.number())
);

MultiDict.assert({1: 'foo', bar: 2}); // ok
MultiDict.assert({1: 123, bar: 'nope'}); // throws
MultiDict.assert({1: false}); // throws
```

And objects can have properties as well as indexers:

```js
const FakeArray = t.object(
  t.property('length', t.number()),
  t.indexer(t.number(), t.any())
);

FakeArray.assert({length: 1, 0: 123}); // ok
FakeArray.assert({0: 123}); // throws
FakeArray.assert({length: 0, nope: true}); // throws
```

## Callable Objects

One side-effect of everything being an object in JavaScript is that functions are objects and can have their own properties just like any other object.
The callable signature of the function is specified using `t.callProperty()`:

```js
const Adder = t.object(
  t.callProperty(t.function(
    t.param('a', t.number()),
    t.param('b', t.number()),
    t.return(t.number())
  )),
  t.property('last', t.number())
);

function validAdder (a, b) {
  const result = a + b;
  validAdder.last = result;
  return result;
}
validAdder.last = 0;

function invalidAdder (a) {
  return a + a;
}
invalidAdder.last = 0;


function invalidAdder2 (a, b) {
  return a + b;
}
invalidAdder2.last = 'nope';


Adder.assert(validAdder); // ok
Adder.assert(invalidAdder); // throws
Adder.assert(invalidAdder2); // throws
```