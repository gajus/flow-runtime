# Type Context

Type contexts represent the "scopes" that types are defined under.
Types always belong to a particular context, and each context can have any number of child contexts.
In most cases using the global context (the one exported by default when you `import t from 'flow-runtime'`) is most appropriate, but you can create sub-contexts with `t.createContext()`.

```js
import t, {TypeContext} from 'flow-runtime';

t instanceof TypeContext; // true
```

## Declaring Types

Types can be registered in a particular context using `t.declare()`.

```js

t.declare('User', t.object({
  id: t.number(),
  name: t.string(),
  email: t.string(),
}));

// "User" can now be used throughout the application.

const User = t.ref('User');
User.assert(someInput);

```

