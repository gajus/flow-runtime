# Primitive Types

`flow-runtime` supports the following primitive types / methods:

- `t.null()` - Returns a `NullLiteralType` which matches a `null` literal value.
- `t.void()` - Returns a `VoidType` which matches `undefined` values.
- `t.number()` - Returns a `NumberType` which matches any number.
- `t.number(123)` - Returns a `NumericLiteralType` which matches exactly `123`.
- `t.boolean()` - Returns a `BooleanType` which matches either `true` or `false`.
- `t.boolean(true)` - Returns a `BooleanLiteralType` which matches exactly `true`.
- `t.string()` - Returns a `StringType` which matches any string.
- `t.string("foo")` - Returns a `StringLiteralType` which matches exactly `"foo"`.
- `t.symbol()` - Returns a `SymbolType` which matches any symbol.
- `t.symbol(Symbol.for("foo"))` - Returns a `SymbolLiteralType` which matches exactly `Symbol.for("foo")`.


```js
import t from 'flow-runtime';

t.null().assert(null); // ok
t.null().assert(false); // throws


t.number(123).assert(123); // ok
t.number(123).assert(456); // throws
t.number(123).assert("qux"); // throws
```