/* @flow */
import {ok, equal} from 'assert';
import invariant from '../../invariant';
import JSONErrorReporter from '../JSONErrorReporter';
import t from '../../globalContext';

const no = (input: any): any => ok(!input);

const expect = (report: ? Object, messages: string[]) => {
  invariant(report && report.errors, "Must have errors.");
  for (let i = 0; i < messages.length; i++) {
    const {field, message, actual} = report.errors[i];
    const assembled = `${field} ${message}, got ${actual}`;
    equal(
      normalize(assembled),
      normalize(messages[i])
    );
  }
};

function normalize (input: string): string {
  return input.trim().replace(/(\s+)/gm, ' ');
}

describe('JSONErrorReporter', () => {
  it('should accept a valid value', () => {
    const type = t.string();
    const validation = t.validate(type, "hello world");
    const reporter = new JSONErrorReporter(validation);
    no(reporter.report());
  });

  it('should reject an invalid value', () => {
    const type = t.string();
    const validation = t.validate(type, false);
    const reporter = new JSONErrorReporter(validation);
    expect(reporter.report(), [
      'Value must be a string, got boolean'
    ]);
  });

  describe('Objects', () => {
    const type = t.object({
      name: t.string(),
      address: {
        line1: t.string()
      }
    });

    it('should accept a valid value', () => {
      const validation = t.validate(type, {name: "foo", address: { line1: 'bar' }});
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(type, false);
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        'Value must be an object, got boolean'
      ]);
    });

    it('should reject another invalid value', () => {
      const validation = t.validate(type, {name: false, address: {}});
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        'name must be a string, got boolean',
        'address.line1 must be a string, got void'
      ]);
    });
  });


  describe('Arrays', () => {
    const type = t.array(t.number());

    it('should accept a valid value', () => {
      const validation = t.validate(type, [1, 2, 3]);
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(type, [1, 2, "foo"]);
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        '[2] must be a number, got string'
      ]);
    });
  });

  describe('Array<Object>', () => {
    const type = t.array(t.object({name: t.string()}));

    it('should accept a valid value', () => {
      const validation = t.validate(type, [{name: 'foo'}]);
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(type, [{name: 'foo'}, {name: 123}]);
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        '[1].name must be a string, got number'
      ]);
    });
  });

  describe('Object<Array>', () => {
    const type = t.array(t.object({items: t.array(t.number())}));

    it('should accept a valid value', () => {
      const validation = t.validate(type, [{items: [1, 2, 3]}]);
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(type, [{items: [1, 2, 3]}, {items: [1, 2, "foo"]}]);
      validation.inputName = 'input';
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        'input[1].items[2] must be a number, got string'
      ]);
    });
  });


  describe('(a: number, b: number) => number', () => {
    const type = t.fn(
      t.param('a', t.number()),
      t.param('b', t.number()),
      t.return(t.number())
    );

    const invalidType = t.fn(
      t.param('a', t.number()),
      t.return(t.number())
    );

    const valid = t.decorate(type)((a: number, b: number) => a + b);
    const invalid = t.decorate(invalidType)((a: number) => a * 2);

    it('should accept a valid value', () => {
      const validation = t.validate(type, valid);
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(type, invalid);
      validation.inputName = 'input';
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        'input requires 2 argument(s), got (a: number) => number'
      ]);
    });
  });

  describe('Thing', () => {
    const Thing = t.class(
      'Thing',
      t.property('name', t.string())
    );

    const AnyThing = t.class(
      'AnyThing',
      t.extends(Thing),
      t.property('name', t.union(t.string(), t.boolean())),
      t.property('url', t.string())
    );

    const Person = t.class('Person', t.property('age', t.number()), t.extends(Thing));

    const validThing = {name: 'hello world'};
    const invalidThing = {name: false};

    const validAnyThing = {name: true, url: 'foo'};
    const invalidAnyThing = {name: false};
    const invalidAnyThing2 = {'url': 'http://example.com/'};


    const validPerson = {name: 'hello world', age: 123};
    const invalidPerson = {name: 'Bob', age: false};
    const invalidPerson2 = {age: 21};

    it('should accept a valid Thing', () => {
      const validation = t.validate(Thing, validThing);
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid Thing', () => {
      const validation = t.validate(Thing, invalidThing);
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        'Thing.name must be a string, got boolean'
      ]);
    });

    it('should accept a valid AnyThing', () => {
      const validation = t.validate(AnyThing, validAnyThing);
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid AnyThing', () => {
      const validation = t.validate(AnyThing, invalidAnyThing);
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        'AnyThing.url must be a string, got void'
      ]);
    });

    it('should reject another invalid AnyThing', () => {
      const validation = t.validate(AnyThing, invalidAnyThing2);
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        'AnyThing.name must be one of: string | boolean, got void'
      ]);
    });

    it('should accept a valid Person', () => {
      const validation = t.validate(Person, validPerson);
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid Person', () => {
      const validation = t.validate(Person, invalidPerson);
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        'Person.age must be a number, got boolean'
      ]);
    });

    it('should reject another invalid Person', () => {
      const validation = t.validate(Person, invalidPerson2);
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        'Person.name must be a string, got void'
      ]);

    });
  });

  describe('Class<Thing>', () => {

    const IThing = t.class('IThing', {
      name: t.string()
    });

    const IInvalid = t.class('IInvalid', {
      num: t.number()
    });

    @t.decorate(IThing)
    class Thing {
      name: string;
    }

    @t.decorate(IInvalid)
    class AnotherThing {

    }

    const ThingClass = t.ref("Class", t.ref(Thing));
    const IThingClass = t.ref("Class", IThing);

    it('should accept a valid value', () => {
      const validation = t.validate(ThingClass, Thing);
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(ThingClass, AnotherThing);
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        `
        Value must be a Class of Thing, got class IInvalid {
          num: number;
        }
        `
      ]);
    });
  });

  describe('$ObjMap', () => {
    const K = t.object(
      t.property('name', t.string()),
      t.property('email', t.string()),
    );
    const V = t.fn(fn => {
      const K = fn.typeParameter('K');
      return [
        t.param('key', K),
        t.return(t.tuple(K, t.string()))
      ];
    });
    const PropTuples = t.ref('$ObjMap', K, V);

    it('accept a valid value', () => {
      const validation = t.validate(PropTuples, {
        name: ['name', 'Hello'],
        email: ['email', 'World']
      });
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(PropTuples, {
        name: [false, 'Hello'],
        email: ['email', 'World']
      });
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        'name[0] must be a string, got boolean'
      ]);
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(PropTuples, {
        name: ['name', 'Hello'],
      });
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        'email must be an Array, got void'
      ]);
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(PropTuples, {
        name: ['name', 'Hello'],
        email: ['email', false]
      });
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        'email[1] must be a string, got boolean'
      ]);
    });
  });

  describe('$ObjMapi', () => {
    const K = t.object(
      t.property('id', t.number()),
      t.property('name', t.string()),
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
    const PropTuples = t.ref('$ObjMapi', K, V);

    it('accept a valid value', () => {
      const validation = t.validate(PropTuples, {
        id: ['id', 123],
        name: ['name', 'World']
      });
      const reporter = new JSONErrorReporter(validation);
      no(reporter.report());
    });

    it('should reject an invalid value', () => {
      const validation = t.validate(PropTuples, {
        id: ['id', false],
        name: ['name', 'World']
      });
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        'id[1] must be a number, got boolean'
      ]);
    });
    it('should reject an invalid value', () => {
      const validation = t.validate(PropTuples, {
        id: ['i d', 123],
        name: ['name', 'World']
      });
      const reporter = new JSONErrorReporter(validation);
      expect(reporter.report(), [
        'id[0] must be exactly "id", got string'
      ]);
    });
  });
});