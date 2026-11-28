const {strictEqual, ok} = require('assert');
const {transformSync} = require('@babel/core');
const {normalizeLibdefSource} = require('../lib');
const loader = require('../lib').default;

function evaluateCJS (esmOutput) {
  const {code} = transformSync(esmOutput, {
    babelrc: false,
    configFile: false,
    plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')]
  });
  const module = {exports: {}};
  const run = new Function('module', 'exports', 'require', code);
  run(module, module.exports, require);
  return module.exports;
}

describe('flow-runtime-loader', () => {
  describe('normalizeLibdefSource', () => {
    it('rewrites declare export type to export type', () => {
      strictEqual(
        normalizeLibdefSource('declare export type A = number;'),
        'export type A = number;'
      );
    });

    it('rewrites declare type to type', () => {
      strictEqual(
        normalizeLibdefSource('declare type A = number;'),
        'type A = number;'
      );
    });

    it('leaves unrelated lines untouched', () => {
      strictEqual(
        normalizeLibdefSource('const x = 1;'),
        'const x = 1;'
      );
    });
  });

  describe('loader', () => {
    it('transforms type declarations into flow-runtime types', () => {
      const source = 'declare export type User = {\n  id: number\n};\n';
      const output = loader.call({resourcePath: 'types.js.flow', query: {}}, source);

      ok(/export const User = t\.type\("User"/.test(output), 'expected runtime type export, got:\n' + output);
    });

    it('runtime exports validate values', () => {
      const source = 'declare export type User = {\n  id: number\n};\n';
      const output = loader.call({resourcePath: 'types.js.flow', query: {}}, source);
      const {User} = evaluateCJS(output);

      strictEqual(typeof User.assert, 'function');
      strictEqual(User.assert({id: 1}).id, 1);

      let threw = false;
      try {
        User.assert({id: 'nope'});
      } catch (error) {
        threw = true;
      }
      strictEqual(threw, true, 'expected invalid value to be rejected');
    });

    it('handles the draft-js style nested declarations from the issue', () => {
      const source = [
        '// @flow',
        'declare export type RawDraftContentBlock = {',
        '  key: string,',
        '  text: string',
        '};',
        'declare export type RawDraftContentState = {',
        '  blocks: Array<RawDraftContentBlock>,',
        '  entityMap: Object',
        '};',
        ''
      ].join('\n');
      const output = loader.call({resourcePath: 'RawDraftContentState.js.flow', query: {}}, source);
      const {RawDraftContentState} = evaluateCJS(output);

      const valid = {
        blocks: [{key: 'a', text: 'hello'}],
        entityMap: {}
      };
      strictEqual(RawDraftContentState.assert(valid).blocks[0].text, 'hello');
    });
  });
});
