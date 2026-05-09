/* @flow */

import fixtures from './fixtures';

import testTransform from './testTransform';

describe('transform', () => {
  for (const [name, {input, expected, annotated, combined, customRuntime, integration}] of fixtures) {
    it(`should transform ${name}`, () => {
      testTransform(input, {assert: true, annotate: false}, expected, integration);
    });
    if (annotated) {
      it(`should transform ${name} with decorations`, () => {
        testTransform(input, {assert: false, annotate: true, integration}, annotated, integration);
      });
    }
    if (combined) {
      it(`should transform ${name} with decorations and assertions`, () => {
        testTransform(input, {assert: true, annotate: true, integration}, combined, integration);
      });
    }
    if (customRuntime) {
      it(`should transform ${name} with custom runtime path`, () => {
        testTransform(input, {libraryName: './custom-flow-runtime'}, customRuntime, integration);
      });
    }
  }

  it('should support requiring the runtime library', () => {
    testTransform(`
      type User = {
        id: number;
        name: string;
      };
    `, {assert: true, annotate: false, libraryImport: 'require'}, `
      const t = require("flow-runtime");

      const User = t.type("User", t.object(
        t.property("id", t.number()),
        t.property("name", t.string())
      ));
    `);
  });

  it('should support requiring a custom runtime library', () => {
    testTransform(`
      type User = {
        id: number;
      };
    `, {
      assert: true,
      annotate: false,
      libraryName: './custom-flow-runtime',
      libraryImport: 'require'
    }, `
      const t = require("./custom-flow-runtime");

      const User = t.type("User", t.object(
        t.property("id", t.number())
      ));
    `);
  });

  it('should reuse an existing required runtime binding', () => {
    testTransform(`
      const rt = require("flow-runtime");

      type User = {
        id: number;
      };
    `, {assert: true, annotate: false, libraryImport: 'require'}, `
      const rt = require("flow-runtime");

      const User = rt.type("User", rt.object(
        rt.property("id", rt.number())
      ));
    `);
  });
});
