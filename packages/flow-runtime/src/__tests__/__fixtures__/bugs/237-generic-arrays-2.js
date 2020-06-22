/* @flow */

import type TypeContext from '../../../TypeContext';

function defineClass(t: TypeContext) {
  let _t$TypeParametersSymb;
  var _dec, _class, _class2, _temp;
  const _TestClassTypeParametersSymbol = Symbol("TestClassTypeParameters");

  let TestClass = (_dec = t.annotate(t.class("TestClass", TestClass => {
    const Value1Type = TestClass.typeParameter("ValueType1");
    const Value2Type = TestClass.typeParameter("ValueType2");
    return [t.method("testMethod")];
  })), _dec(_class = (_temp = (_t$TypeParametersSymb = t.TypeParametersSymbol, _class2 = class TestClass {
    constructor() {
      this[_TestClassTypeParametersSymbol] = {
        ValueType1: t.typeParameter("ValueType1"),
        ValueType2: t.typeParameter("ValueType2")
      };
    }

    testMethod() {
      const items1 = t.array(this[_TestClassTypeParametersSymbol].ValueType1)
        .assert(JSON.parse('[{ "a": null, "b": "b" }, { "a": "a", "b": null }]'));
      const items2 = t.array(this[_TestClassTypeParametersSymbol].ValueType2)
        .assert(JSON.parse('[{ "a": null, "b": "b" }, { "a": "a", "b": null }]'));
      return items1.concat(items2);
    }

  }), _class2[_t$TypeParametersSymb] = _TestClassTypeParametersSymbol, _temp)) || _class);
  return TestClass;
}

// will work for const test = TestClass<any, any>();
export function pass(t: TypeContext) {
  const TestClass = defineClass(t);
  const testClass = t.ref(TestClass, t.any(), t.any()).assert(new TestClass());
  return testClass.testMethod();
}

// will fail for const test = TestClass();
export function fail(t: TypeContext) {
  const TestClass = defineClass(t);
  const testClass = t.ref(TestClass).assert(new TestClass());
  return testClass.testMethod();
}
