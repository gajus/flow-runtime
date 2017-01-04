/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';

import Example from '../Example';

const simplestObjectCode = `
import t from 'flow-runtime';

const Thing = t.object({
  name: t.string(),
  url: t.string()
});

console.log(Thing.assert({name: 'Widget', url: 'http://example.com/Thing'}).name);
console.log(Thing.assert({name: false}));
`.trim();

const simplestObjectAlternateCode = `
const Thing = t.object(
  t.property('name', t.string()),
  t.property('url', t.string())
);
console.log(Thing.assert({name: false}));
`.trim();


const simplestObjectFlowCode = `
type Thing = {
  name: string;
  url: string;
};
console.log(Thing.assert({name: false}));
`.trim();

const optionalPropsCode = `
const Thing = t.object(
  t.property('name', t.string()),
  t.property('url', t.string(), true) // url is optional.
);

Thing.assert({name: 'Widget'}); // OK
Thing.assert({name: 'Widget', url: 'http://example.com/'}); // OK
Thing.assert({name: 'Widget', url: false}); // throws
`.trim();

const selfReferentialObjectsCode = `
const Tree = t.type('Tree', Tree => t.object(
    t.property('value', t.any()),
    t.property('left', Tree, true), // optional
    t.property('right', Tree, true) // optional
));

const validTree = {
  value: 'hello',
  left: {
    value: 'world',
  }
};

const invalidTree = {
  value: 'hello',
  left: {
    nope: true
  },
  right: false
};

Tree.assert(validTree); // ok
Tree.assert(invalidTree); // throws
`.trim();

const objectIndexersSimpleCode = `
const NumberStringDict = t.object(
  t.indexer('key', t.number(), t.string())
);

NumberStringDict.assert({1: 'foo', 2: 'bar'}); // ok
NumberStringDict.assert({nope: 'foo'}); // throws
NumberStringDict.assert({1: 123}); // throws
`.trim();

const objectIndexersMultiCode = `
const MultiDict = t.object(
  t.indexer('index', t.number(), t.string()),
  t.indexer('key', t.string(), t.number())
);

MultiDict.assert({1: 'foo', bar: 2}); // ok
MultiDict.assert({1: 123, bar: 'nope'}); // throws
MultiDict.assert({1: false}); // throws
`.trim();

const objectIndexersWithPropsCode = `
const FakeArray = t.object(
  t.property('length', t.number()),
  t.indexer('key', t.number(), t.any())
);

FakeArray.assert({length: 1, 0: 123}); // ok
FakeArray.assert({0: 123}); // throws
FakeArray.assert({length: 0, nope: true}); // throws
`.trim();

const callableObjectsCode = `
const Adder = t.object(
  t.callProperty(t.function(
    t.param('a', t.number()),
    t.param('b', t.number()),
    t.return(t.number())
  )),
  t.property('last', t.number())
);

function validAdder (a, b) {
  const result = a + b;
  validAdder.last = result;
  return result;
}
validAdder.last = 0;

function invalidAdder (a) {
  return a + a;
}
invalidAdder.last = 0;


function invalidAdder2 (a, b) {
  return a + b;
}
invalidAdder2.last = 'nope';


Adder.assert(validAdder); // ok
Adder.assert(invalidAdder); // throws
Adder.assert(invalidAdder2); // throws
`.trim();

@observer
export default class ObjectTypesPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <h1>Object Types</h1>
        </header>
        <div className="container">

          <h4>Simple Objects</h4>
          <p>The simplest objects can be specified as a dictionary of key names to types:</p>
          <Example code={simplestObjectCode} hideOutput inline/>
          <p>The definition above can also be written as:</p>
          <Example code={simplestObjectAlternateCode} hideOutput inline/>
          <p>Or when using the babel plugin:</p>
          <Example code={simplestObjectFlowCode} hideOutput inline/>
          <hr />
          <h4>Optional Properties</h4>
          <p><code>t.property()</code> takes a third argument, which should be <code>true</code> if the given property is optional:</p>
          <Example code={optionalPropsCode} hideOutput inline/>
          <hr />
          <h4>Self-referential Objects</h4>
          <p>Sometimes object types need to refer to themselves, for this we give the object a type alias, for example:</p>
          <Example code={selfReferentialObjectsCode} hideOutput inline />
          <hr />
          <h4>Object Indexers</h4>
          <p>Objects are often used as hashmaps or dictionaries in JavaScript, to indicate the type for the key and value for an object in hash-map mode, we use <code>t.indexer()</code>:</p>
          <Example code={objectIndexersSimpleCode} hideOutput inline />
          <p>Objects can have multiple indexers:</p>
          <Example code={objectIndexersMultiCode} hideOutput inline />
          <p>And objects can have properties as well as indexers:</p>
          <Example code={objectIndexersWithPropsCode} hideOutput inline />
          <hr />
          <h4>Callable Objects</h4>
          <p>One side-effect of everything being an object in JavaScript is that functions are objects and can have their own properties just like any other object.</p>
          <p>The callable signature of the function is specified using <code>t.callProperty()</code>:</p>
          <Example code={callableObjectsCode} hideOutput inline />
        </div>
      </div>
    );
  }
}

