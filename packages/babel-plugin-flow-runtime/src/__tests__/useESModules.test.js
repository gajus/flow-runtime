/* @flow */

import testTransform from './testTransform';

describe('useESModules option', () => {
  const input = `
    type User = {
      id: number,
      name: string
    };
  `;

  it('should emit an import statement by default', () => {
    testTransform(input, {assert: true, annotate: false}, `
      import t from "flow-runtime";
      const User = t.type("User", t.object(
        t.property("id", t.number()),
        t.property("name", t.string())
      ));
    `);
  });

  it('should emit a require call when useESModules is false', () => {
    testTransform(input, {assert: true, annotate: false, useESModules: false}, `
      var t = require("flow-runtime");
      const User = t.type("User", t.object(
        t.property("id", t.number()),
        t.property("name", t.string())
      ));
    `);
  });
});
