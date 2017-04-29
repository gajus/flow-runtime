/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const _ContainerTypeParametersSymbol = Symbol("ContainerTypeParameters");

  @t.annotate(
    t.class("Container", Container => {
      const T = Container.typeParameter("T");
      return [t.method("constructor", t.param("value", t.flowInto(T)))];
    })
  )
  class Container {
    value: any;
    // @flowIgnore
    static [t.TypeParametersSymbol] = _ContainerTypeParametersSymbol;

    constructor(value) {
      // @flowIgnore
      this[_ContainerTypeParametersSymbol] = {
        T: t.typeParameter("T")
      };

      // @flowIgnore
      let _valueType = t.flowInto(this[_ContainerTypeParametersSymbol].T);

      t.param("value", _valueType).assert(value);

      this.value = value;
    }
  }

  @t.annotate(
    t.class(
      "StringContainer",
      t.extends(Container, t.string()),
      t.method("constructor", t.rest("args", t.any()))
    )
  )
  class StringContainer extends Container {
    constructor(...args) {
      super(...args);
      t.bindTypeParameters(this, t.string());
    }
  }

  const Klazz = t.Class(t.ref(Container, t.string())).assert(StringContainer);

  return Klazz;
}

