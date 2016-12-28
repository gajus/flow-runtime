# Functions

Function types can be expressed using `t.function()`:

```js
const Adder = t.function(
  t.param('a', t.number()),
  t.param('b', t.number()),
  t.return(t.number())
);
```

However, validation for functions is a little trickier. If a function is not annotated, there is no way for us to inspect the arguments or return value without running it, which is unacceptable.
For that reason, function type validation is quite permissive for non-annotated functions:

```js
Adder.assert((a, b) => 'wat?'); // does not throw, even though the return value is wrong.
Adder.assert(a => 123); // throws because the function does not have enough parameters.
```

We solve this problem using `t.annotate()`:

```js

const add = (a, b) => a + b;

t.annotate(
  add,
  Adder
);

const bad = (a, b) => "wat";

t.annotate(
  bad,
  t.function(
    t.param('a', t.string()),
    t.param('b', t.string()),
    t.return(t.string())
  )
);


Adder.assert(add); // ok
Adder.assert(bad); // throws
```

## Optional Parameters

```js
const Greeter = t.function(
  t.param('name', t.string(), true),
  t.return(t.string())
);
const greet = t.annotate(
  (name?) => 'Hello ' + (name || 'World'),
  Greeter
);
```

## Rest Parameters

```js
type Concatenator = (...args: any[]) => any[];
```

->

```js
const Concatenator = t.type('Concatenator', t.fn(
  t.rest('args', t.array(t.any())),
  t.return(t.array(t.any()))
));
```

## Polymorphic Functions

```js
type DynamicAdder = <T: string | number> (a: T, b: T) => T;
```
->
```js
const DynamicAdder = t.type('DynamicAdder', DynamicAdder => {
  const T = DynamicAdder.typeParameter('T', t.union(t.string(), t.number()));
  return [
    t.param('a', T),
    t.param('b', T),
    t.return(T)
  ];
});
```
