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
});
