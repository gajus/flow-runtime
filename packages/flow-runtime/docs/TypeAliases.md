# Type Aliases

It's often useful to associate a name with a particular type, especially when that type is reused.
For this `flow-runtime` has the concept of `TypeAlias`es, just as flow itself does.

The following flow type alias:
```js
type User = {name: string};
```

is expressed as:
```js
const User = t.type('User', {name: t.string()});

User.assert({name: 'Sally'}); // ok
User.assert({name: false}); // throws with message "Invalid User"
```

# Polymorphic Type Aliases
Type aliases can define `TypeParameter`s, allowing bounded polymorphism in the same way that flow does:

```js
type Dict<K: string | number, V> = {[key: K]: V};
```
is expressed as:
```js
const Dict = t.type('Dict', Dict => {
  const K = Dict.typeParameter('K', t.union(t.string(), t.number()));
  const V = Dict.typeParameter('V');
  return t.object(
    t.indexer(K, V)
  );
});

Dict.assert({
  1: 'OK',
  2: true,
  foo: 123,
  bar: 'yes'
}); // OK
```