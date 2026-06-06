/* @flow */

import path from 'path';
import webpack from 'webpack';
import {equal, ok} from 'assert';

import flowRuntimeLoader from './index';

function runLoader (source: string | Buffer, options: Object = {}, context: Object = {}): Promise<Object> {
  let cacheable = false;

  return new Promise((resolve, reject) => {
    const loaderContext = {
      resourcePath: '/project/types.js.flow',
      sourceMap: false,
      getOptions: () => options,
      cacheable: () => {
        cacheable = true;
      },
      async: () => (error, code, sourceMap) => {
        if (error) {
          reject(error);
        }
        else {
          resolve({cacheable, code, sourceMap});
        }
      },
      ...context
    };

    flowRuntimeLoader.call(loaderContext, source);
  });
}

function compileFixture (): Promise<Object> {
  return new Promise((resolve, reject) => {
    webpack({
      mode: 'development',
      target: 'node',
      entry: path.join(__dirname, '../test/fixtures/webpack/entry.js'),
      output: {
        filename: 'bundle.js',
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '../test/fixtures/webpack/dist')
      },
      resolveLoader: {
        alias: {
          'flow-runtime-loader': path.join(__dirname, '../src/index.js')
        }
      },
      resolve: {
        alias: {
          'flow-runtime': path.join(__dirname, '../test/fixtures/webpack/flow-runtime.js')
        }
      },
      module: {
        rules: [
          {
            test: /\.js\.flow$/,
            use: [
              {
                loader: 'flow-runtime-loader',
                options: {
                  annotate: false
                }
              }
            ]
          }
        ]
      }
    }, (error, stats) => {
      if (error) {
        reject(error);
        return;
      }
      if (stats.hasErrors()) {
        reject(new Error(stats.toString()));
        return;
      }
      resolve(stats);
    });
  });
}

describe('flow-runtime-loader', () => {
  it('converts exported Flow types into runtime declarations', async () => {
    const result = await runLoader(`
      // @flow
      export type User = {
        id: number,
        name: string
      };
    `);

    ok(result.cacheable);
    ok(result.code.includes('import t from "flow-runtime";'));
    ok(result.code.includes('export const User = t.type("User"'));
    ok(result.code.includes('t.property("id", t.number())'));
    ok(!result.code.includes('export type User'));
  });

  it('passes loader options to babel-plugin-flow-runtime', async () => {
    const result = await runLoader(`
      // @flow
      export type User = {
        name: string
      };
    `, {
      libraryName: './custom-flow-runtime'
    });

    ok(result.code.includes('import t from "./custom-flow-runtime";'));
  });

  it('keeps imported Flow types available as runtime references', async () => {
    const result = await runLoader(`
      // @flow
      import type {RawDraftContentBlock} from './RawDraftContentBlock';

      export type RawDraftContentState = {
        blocks: Array<RawDraftContentBlock>
      };
    `);

    ok(result.code.includes('import { RawDraftContentBlock as _RawDraftContentBlock } from \'./RawDraftContentBlock\';'));
    ok(result.code.includes('const RawDraftContentBlock = t.tdz(() => _RawDraftContentBlock);'));
    ok(result.code.includes('export const RawDraftContentState = t.type("RawDraftContentState"'));
  });

  it('supports legacy webpack query options', async () => {
    const result = await runLoader(`
      // @flow
      export type User = {
        name: string
      };
    `, {}, {
      getOptions: undefined,
      query: '?libraryName=./typed&annotate=false'
    });

    ok(result.code.includes('import t from "./typed";'));
    ok(!result.code.includes('t.annotate'));
  });

  it('returns synchronously when no async callback is available', () => {
    const code = flowRuntimeLoader.call({
      resourcePath: '/project/types.js.flow',
      sourceMap: false,
      getOptions: () => ({})
    }, `
      // @flow
      export type User = {
        name: string
      };
    `);

    equal(typeof code, 'string');
    ok(code.includes('export const User = t.type("User"'));
  });

  it('works as a webpack loader for js.flow imports', async () => {
    const stats = await compileFixture();

    ok(stats.hasWarnings() === false);
  });
});
