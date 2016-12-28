# Exotic Types


## Class<T>

```js
type UserClass = Class<User>;
```
->
```js
const UserClass = t.type('UserClass', t.ref('Class', User));
UserClass.assert(User); // ok
UserClass.assert(false); // throws
```


## $Keys<T>

```js
type UserKeys = $Keys<User>;
```
->
```js
const UserKeys = t.type('UserKeys', t.ref('$Keys', User))
```

## $Shape<T>

```js
type UserShape = $Shape<User>;
```
->
```js
const UserShape = t.type('UserShape', t.ref('$Shape', User))
```

## $ObjMap<T, <K>(k: K) => K>
## $ObjMapi<T, <K, V>(k: K, v: V) => [K, V]>

TODO Docs

