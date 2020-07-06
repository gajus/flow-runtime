/* @flow */

import type TypeContext from '../../../TypeContext';

function defineClass(t: TypeContext) {
  let _t$TypeParametersSymb;
  var _dec, _class, _class2, _temp;
  const _TestClassTypeParametersSymbol = Symbol("TestClassTypeParameters");

  let TestClass = (_dec = t.annotate(t.class("TestClass", TestClass => {
    const ValueType = TestClass.typeParameter("ValueType");
    return [t.method("testMethod")];
  })), _dec(_class = (_temp = (_t$TypeParametersSymb = t.TypeParametersSymbol, _class2 = class TestClass {
    constructor() {
      this[_TestClassTypeParametersSymbol] = {
        ValueType: t.typeParameter("ValueType"),
      };
    }

    testMethod( toParse ) {
      return t.array(this[_TestClassTypeParametersSymbol].ValueType).assert(JSON.parse(toParse));
    }

  }), _class2[_t$TypeParametersSymb] = _TestClassTypeParametersSymbol, _temp)) || _class);
  return TestClass;
}

export function pass(t: TypeContext) {
  const TestClass = defineClass(t);

  t.ref(TestClass, t.string()).assert(new TestClass()).testMethod('["string1", "string2"]');
  t.ref(TestClass, t.number()).assert(new TestClass()).testMethod('[0, 1, 2, 3]');
  t.ref(TestClass, t.boolean()).assert(new TestClass()).testMethod('[false, true]');
  return true;
}

// internal type still used for type validation inside testMethod()
export function fail(t: TypeContext) {
  const TestClass = defineClass(t);
  t.ref(TestClass, t.number()).assert(new TestClass())
    .testMethod('["string1", "string2"]');
}
