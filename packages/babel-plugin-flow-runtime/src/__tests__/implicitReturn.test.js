/* @flow */

import testTransform from './testTransform';

describe('implicit return assertions', () => {
  it('should assert implicit return in a function with empty body', () => {
    testTransform(`
      function foo(): string {
      }
    `, {assert: true, annotate: false}, `
      import t from "flow-runtime";
      function foo() {
        const _returnType = t.return(t.string());
        return _returnType.assert();
      }
    `);
  });

  it('should assert implicit return when the body does not end with a return', () => {
    testTransform(`
      function bar(): string {
        const x = 1;
      }
    `, {assert: true, annotate: false}, `
      import t from "flow-runtime";
      function bar() {
        const _returnType = t.return(t.string());
        const x = 1;
        return _returnType.assert();
      }
    `);
  });

  it('should assert implicit return when only some branches return', () => {
    testTransform(`
      function qux(n: number): string {
        if (n > 1) {
          return "big";
        }
      }
    `, {assert: true, annotate: false}, `
      import t from "flow-runtime";
      function qux(n) {
        let _nType = t.number();
        const _returnType = t.return(t.string());
        t.param("n", _nType).assert(n);
        if (n > 1) {
          return _returnType.assert("big");
        }
        return _returnType.assert();
      }
    `);
  });

  it('should not add an implicit return when the body already ends with one', () => {
    testTransform(`
      function baz(): string {
        return "ok";
      }
    `, {assert: true, annotate: false}, `
      import t from "flow-runtime";
      function baz() {
        const _returnType = t.return(t.string());
        return _returnType.assert("ok");
      }
    `);
  });
});
