/* @flow */
import {ok} from 'assert';

import t from './globalContext';

const no = (input: any): any => ok(!input);

describe('Typed API', () => {
  it('should check a string', () => {
    const type = t.string();
    ok(type.match('helo world'));
    no(type.match(false));
  });

  it('should check a simple object', () => {
    const type = t.object(
      t.property('foo', t.boolean()),
      t.property('bar', t.string('hello'))
    );

    console.log(type.toString());
    ok(type.match({
      foo: true,
      bar: 'hello'
    }));
  });

  it('should make a tuple type', () => {
    const type = t.tuple(
      t.string(),
      t.number(),
      t.boolean()
    );

    ok(type.match(['hello', 213, true]));
    ok(type.match(['hello', 213, true, 'still ok']));
    no(type.match(['hello', 213, 'nah']));
  });

  it('should declare a named type', () => {
    const User = t.declare('User', t.object(
      t.property('id', t.number()),
      t.property('name', t.string())
    ));

    User.addConstraint(input => input.name.length > 2 && input.name.length < 45);
    console.log(User.toString());

    no(User.match({
      id: 123,
      name: false
    }));

    no(User.match({
      id: 123,
      name: ''
    }));
    ok(User.match({
      id: 123,
      name: 'this is valid'
    }));
    ok(User.match({
      id: 123,
      name: 'this is valid',
      extra: 'okay'
    }));
  });

  it('should use a Map<string, number>', () => {
    const type = t.instanceOf(Map, t.string(), t.number());
    console.log(type.toString());
    ok(type.match(new Map()));
    ok(type.match(new Map([
      ['valid', 123]
    ])));
    no(type.match(new Map([
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

    console.log(type.toString());
    const good = (input: boolean) => input ? 'yes' : 'no';
    const better = (input: boolean, etc: boolean) => input && etc ? 'yes' : 'no';
    const bad = () => undefined;
    ok(type.match(good));
    ok(type.match(better));
    no(type.match(bad));
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
    ok(type.match(good));
    ok(type.match(better));
    no(type.match(bad));
    console.log(type.toString());
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
        t.property('left', t.nullable(t.instanceOf(Tree, T))),
        t.property('right', t.nullable(t.instanceOf(Tree, T))),
      );
    });
    console.log(Tree.toString());
    const candidate = {
      value: 'hello world',
      left: null,
      right: {
        value: 'foo',
        left: null,
        right: null
      }
    };
    ok(Tree.match(candidate));
    //console.log(JSON.stringify(Tree, null, 2))

  });

  it('should build an object', () => {
    const type = t.object(
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
    console.log('\n');
    console.log(type.toString());
    console.log('\n');
  });
});