/* @flow */

import testTransform from './testTransform';

describe('$ReadOnlyArray conversion', () => {
  it('should convert $ReadOnlyArray type aliases', () => {
    testTransform(`
      type Thing = $ReadOnlyArray<string | number>;
    `, {assert: true, annotate: false}, `
      import t from "flow-runtime";
      const Thing = t.type("Thing", t.$readOnlyArray(t.union(t.string(), t.number())));
    `);
  });

  it('should convert $ReadOnlyArray in function annotations', () => {
    testTransform(`
      function first(input: $ReadOnlyArray<number>): number {
        return input[0];
      }
    `, {assert: true, annotate: false}, `
      import t from "flow-runtime";
      function first(input) {
        let _inputType = t.$readOnlyArray(t.number());
        const _returnType = t.return(t.number());
        t.param("input", _inputType).assert(input);
        return _returnType.assert(input[0]);
      }
    `);
  });
});
