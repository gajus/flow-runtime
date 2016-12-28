# Unions And Intersections
Unions define a number of possible types for a value, and the value must match one of those types, whereas with intersections the value must match every defined type.

# Unions

```js
type Status = 'ACTIVE' | 'INACTIVE';
```
->
```js
const Status = t.type('Status', t.union(
  t.string('ACTIVE'),
  t.string('INACTIVE')
));

Status.assert('ACTIVE'); // ok
Status.assert('INACTIVE'); // ok
Status.assert(false); // throws
Status.assert('nope'); // throws
```


# Intersections

```js
type Named = {name: string};
type Linkable = {url: string};

type Thing = Named & Linkable;
```
->
```
const Named = t.object({name: t.string()});
const Linkable = t.object({url: t.string()});
const Thing = t.type('Thing', t.intersect(Named, Linkable));

Thing.assert({name: 'Widget', url: 'http://example.com/'}); // ok
Thing.assert({name: 'Widget'}); // throws
Thing.assert({url: 'http://example.com/'}); // throws
Thing.assert({name: false, url: 'http://example.com/'}); // throws
```