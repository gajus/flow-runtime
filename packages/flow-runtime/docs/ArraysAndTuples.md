# Arrays and Tuples

# Simple Array

The following declares an array type that accepts any value:

```js
import t from 'flow-runtime';

const AnyArray = t.array(); // same as t.array(t.any())

AnyArray.assert([]); // ok
AnyArray.assert([1, 'foo', true]); // ok
AnyArray.assert(false); // throws
```

# Array of a given type

```js
const StringArray = t.array(t.string());

StringArray.assert([]); // ok
StringArray.assert(["foo", "bar"]); // ok
StringArray.assert(["foo", 123]); // throws
StringArray.assert("nope"); // throws
```

# Tuples
Tuples are arrays of values, with the element at each index having an independently defined type:

```js
const KeyValue = t.tuple(t.number(), t.string());

KeyValue.assert([123, "foo bar"]); // ok
KeyValue.assert([456, "qux", true, false]); // ok, we ignore subsequent values
KeyValue.assert([456]); // throws
KeyValue.assert([false, "qux"]); // throws
KeyValue.assert([123, false]); // throws
```
