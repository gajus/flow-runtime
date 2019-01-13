/* @flow */

import testTransform from './testTransform';

describe('optInOnly', () => {
  it("transforms files with @flow-runtime annotation", () => {
    const input = `
    /* @flow */
    /* @flow-runtime enable */

    type Demo = 123;

    ("nope": Demo);

    const demo = ([foo]: string[]): string => foo;
    `;

    const expected = `
    import t from "flow-runtime";
    /* @flow */
    /* @flow-runtime enable */
    const Demo = t.type("Demo", t.number(123));
    let _undefinedType = Demo;
    "nope";
    const demo = (_arg) => {
    let [foo] = _arg;
    return foo;
    };
    `;

    testTransform(input, {annotate: false, assert: false, optInOnly: true}, expected);
  });
  it("doesn't transform files without @flow-runtime annotation", () => {
    const input = `
    /* @flow */

    const Demo = 123;
    `;

    const expected = `
    /* @flow */

    const Demo = 123;
    `;

    testTransform(input, {optInOnly: true}, expected); 
  });
});
