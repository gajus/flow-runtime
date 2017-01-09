/* @flow */
import {ok, throws} from 'assert';

import t from './globalContext';

const no = (input: any): any => ok(!input);

describe('Typed API', () => {
  it('should check a string', () => {
    const type = t.string();
    ok(type.accepts('helo world'));
    no(type.accepts(false));
  });

  it('should check a simple object', () => {
    const type = t.object(
      t.property('foo', t.boolean()),
      t.property('bar', t.string('hello'))
    );

    ok(type.accepts({
      foo: true,
      bar: 'hello'
    }));
  });


  it('should check a simple object with shortcut syntax', () => {
    const type = t.exactObject({
      foo: t.boolean(),
      bar: t.string()
    });

    ok(type.accepts({
      foo: true,
      bar: 'hello'
    }));

    no(type.accepts({
      foo: true,
      bar: 'hello',
      baz: 44
    }));

    no(type.accepts({
      foo: 123,
    }));
  });

  it('should check an exact object', () => {
    const type = t.object({
      foo: t.boolean(),
      bar: t.string()
    });

    ok(type.accepts({
      foo: true,
      bar: 'hello'
    }));

    no(type.accepts({
      foo: 123,
    }));
  });

  it('should make a tuple type', () => {
    const type = t.tuple(
      t.string(),
      t.number(),
      t.boolean()
    );

    ok(type.accepts(['hello', 213, true]));
    ok(type.accepts(['hello', 213, true, 'still ok']));
    no(type.accepts(['hello', 213, 'nah']));
  });

  it('should declare a named type', () => {
    const User = t.declare('User', t.object(
      t.property('id', t.number()),
      t.property('name', t.string())
    ));

    User.addConstraint(input => {
      if (input.name.length <= 2) {
        return "Name is too short!";
      }
      else if (input.name.length >= 45) {
        return "Name is too long!";
      }
    });

    no(User.accepts({
      id: 123,
      name: false
    }));

    no(User.accepts({
      id: 123,
      name: ''
    }));
    ok(User.accepts({
      id: 123,
      name: 'this is valid'
    }));
    ok(User.accepts({
      id: 123,
      name: 'this is valid',
      extra: 'okay'
    }));
  });

  it('should use a Map<string, number>', () => {
    const type = t.ref(Map, t.string(), t.number());
    ok(type.accepts(new Map()));
    ok(type.accepts(new Map([
      ['valid', 123]
    ])));
    no(type.accepts(new Map([
      ['valid', 123],
      ['notvalid', false]
    ])));

  });

  it('should make a simple function type', () => {
    const type = t.fn(
      t.param('input', t.boolean()),
      t.param('etc', t.boolean(), true),
      t.return(t.string())
    );

    const good = (input: boolean) => input ? 'yes' : 'no';
    const better = (input: boolean, etc: boolean) => input && etc ? 'yes' : 'no';
    const bad = () => undefined;
    ok(type.accepts(good));
    ok(type.accepts(better));
    no(type.accepts(bad));
  });

  it('should make a parameterized function type', () => {
    const type = t.fn((fn) => {
      const T = fn.typeParameter('T', t.union(t.string(), t.number()));
      return [
        t.param('input', T),
        t.param('etc', t.boolean(), true),
        t.return(t.nullable(T))
      ];
    });

    function good <T> (input: T): T {
      return input;
    }
    function better <T> (input: T, etc?: boolean): ? T {
      return etc ? input : null;
    }
    function bad (): void {
      return;
    }
    ok(type.accepts(good));
    ok(type.accepts(better));
    no(type.accepts(bad));
  });

  it('should build a tree-like object', () => {
    type ITree <T> = {
      value: T;
      left: ? ITree<T>;
      right: ? ITree<T>;
    };
    const Tree = t.type('Tree', (Tree) => {
      const T = Tree.typeParameter('T');
      return t.object(
        t.property('value', T),
        t.property('left', t.nullable(t.ref(Tree, T))),
        t.property('right', t.nullable(t.ref(Tree, T))),
      );
    });
    const candidate = {
      value: 'hello world',
      left: null,
      right: {
        value: 'foo',
        left: null,
        right: null
      }
    };
    ok(Tree.assert(candidate));

  });

  it('should handle named types', () => {
    const UserEmailAddress = t.type('UserEmailAddress', t.string());
    UserEmailAddress.addConstraint(input => {
      if (!/@/.test(input)) {
        return "must be a valid email address";
      }
    });

    const User = t.type('User', t.object(
      t.property('id', t.number()),
      t.property('name', t.string()),
      t.property('email', UserEmailAddress)
    ));


    const sally = {
      id: 123,
      name: 'Sally',
      email: 'invalid'
    };

    throws(() => User.assert(sally));
    sally.email = 'sally@example.com';
    User.assert(sally);

  });

  it('should handle Class<User>', () => {

    @t.decorate(t.object(
      t.property('id', t.number()),
      t.property('name', t.string()),
      t.property('email', t.string())
    ))
    class User {
      id: number;
      name: string;
      email: string;
    }


    class AdminUser extends User {

    }

    @t.decorate(t.object(
      t.property('name', t.string()),
    ))
    class Role {
      name: string;
    }

    const INameable = t.type('Nameable', t.object(
      t.property('name', t.string())
    ));
    const INomable = t.type('Nameable', t.object(
      t.property('nom', t.string())
    ));
    const INameableClass = t.ref('Class', INameable);
    const INomableClass = t.ref('Class', INomable);

    const IUserClass = t.ref('Class', t.ref(User));
    const IAdminUserClass = t.ref('Class', t.ref(AdminUser));
    no(IUserClass.accepts(Role));
    ok(IUserClass.accepts(User));
    ok(IUserClass.accepts(AdminUser));

    no(IAdminUserClass.accepts(Role));
    no(IAdminUserClass.accepts(User));
    ok(IAdminUserClass.accepts(AdminUser));

    ok(INameableClass.accepts(User));
    ok(INameableClass.accepts(Role));
    ok(INameableClass.accepts(AdminUser));
    no(INomableClass.accepts(User));


    //t.ref(Map, t.string(), t.number()).assert(new Map([['hello', false]]));
  });

  it('should $Diff<A, B>', () => {
    const A = t.object(
      t.property('name', t.string()),
      t.property('email', t.string()),
    );
    const B = t.object(
      t.property('email', t.string('example@example.com'))
    );

    const C = t.ref('$Diff', A, B);

    no(C.accepts({}));
    ok(C.accepts({name: 'Alice'}));
    ok(C.accepts({name: 'Alice', email: 'alice@example.com'}));
    no(C.accepts({email: 'alice@example.com'}));
    no(C.accepts({name: false, email: 'alice@example.com'}));

  });


  it('should $Shape<A>', () => {
    const A = t.object(
      t.property('name', t.string()),
      t.property('email', t.string()),
    );
    const B = t.ref('$Shape', A);

    ok(B.accepts({}));
    ok(B.accepts({name: 'Alice'}));
    ok(B.accepts({name: 'Alice', email: 'alice@example.com'}));
    no(B.accepts({nope: false}));
    no(B.accepts({name: false, email: 'alice@example.com'}));
    no(B.accepts({name: 'Alice', email: 'alice@example.com', extra: true}));

  });

  it('should $Keys<A>', () => {
    const A = t.object(
      t.property('name', t.string()),
      t.property('email', t.string()),
    );
    const B = t.ref('$Keys', A);

    ok(B.accepts('name'));
    ok(B.accepts('email'));
    no(B.accepts('nope'));
    no(B.accepts(false));
    no(B.accepts({}));
  });

  it('should $Keys<typeOf A>', () => {
    const A = t.typeOf({
      name: 'Alice',
      email: 'example@example.com'
    });
    const B = t.ref('$Keys', A);

    ok(B.accepts('name'));
    ok(B.accepts('email'));
    no(B.accepts('nope'));
    no(B.accepts(false));
    no(B.accepts({}));
  });


  it.skip('should $ObjMap<K, V>', () => {
    const K = t.object(
      t.property('name', t.string()),
      t.property('email', t.string()),
    );
    const V = t.fn(fn => {
      const K = fn.typeParameter('K');
      const V = fn.typeParameter('V');
      return [
        t.param('key', K),
        t.param('value', V),
        t.return(t.tuple(K, V))
      ];
    });
    const B = t.ref('$ObjMap', K, V);

    B.assert({
      name: ['name', 'Hello'],
      email: ['email', 'World']
    });
    ok(B.accepts({}));
    ok(B.accepts({name: 'Alice'}));
    ok(B.accepts({name: 'Alice', email: 'alice@example.com'}));
    no(B.accepts({nope: false}));
    no(B.accepts({name: false, email: 'alice@example.com'}));
    no(B.accepts({name: 'Alice', email: 'alice@example.com', extra: true}));

  });

  it('should build an object', () => {
    t.object(
      t.property('foo', t.string('bar')),
      t.property('qux', t.union(
        t.string(),
        t.number(),
        t.boolean()
      )),
      t.property('nested', t.object(
        t.property('again', t.object(
          t.indexer('nom', t.string(), t.any()),
          t.property('hello', t.string('world')),
          t.property('bar', t.string()),
          t.property('meth', t.fn(
            t.param('a', t.boolean(false)),
            t.return(t.string())
          )),
          t.method('m', (fn) => {
            const T = fn.typeParameter('T');
            return [
              t.param('a', T),
              t.return(T)
            ];
          }),
          t.property('typed', t.fn((fn) => {
            const T = fn.typeParameter('T', t.string());
            return [
              t.param('input', T),
              t.return(t.object(
                t.property('nn', T)
              ))
            ];
          }))
        ))
      ))
    );
  });
});