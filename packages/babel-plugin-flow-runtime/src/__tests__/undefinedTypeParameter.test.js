/* @flow */

import testTransform from './testTransform';

describe('type variables with assertions disabled', () => {
  it('should not emit type variable references for annotated declarations when assert is false', () => {
    testTransform(`
      function foo<X>() {
        let bar: X
      }
    `, {assert: false, annotate: false}, `
      import t from "flow-runtime";
      function foo() {
        let bar;
      }
    `);
  });

  it('should not emit type variable references for statement typecasts when assert is false', () => {
    testTransform(`
      function foo<X>() {
        (baz(): X);
      }
    `, {assert: false, annotate: false}, `
      import t from "flow-runtime";
      function foo() {
        baz();
      }
    `);
  });

  it('should still emit type variables when assert is true', () => {
    testTransform(`
      function foo<X>() {
        let bar: X
      }
    `, {assert: true, annotate: false}, `
      import t from "flow-runtime";
      function foo() {
        const X = t.typeParameter("X");
        let _barType = X, bar;
      }
    `);
  });

  it('should keep annotating type parameters when annotate is true and assert is false', () => {
    testTransform(`
      function foo<X>() {
        let bar: X
      }
    `, {assert: false, annotate: true}, `
      import t from "flow-runtime";
      function foo() {
        let bar;
      }
      t.annotate(foo, t.function(_fn => {
        const X = _fn.typeParameter("X");
        return [];
      }));
    `);
  });
});
