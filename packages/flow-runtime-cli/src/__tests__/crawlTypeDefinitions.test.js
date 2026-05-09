/* @flow */

import {ok} from 'assert';
import path from 'path';
import crawlTypeDefinitions from '../crawlTypeDefinitions';

describe('Crawl Type Definitions', () => {
  it('discovers definitions from .js.flow files', async () => {
    const graph = await crawlTypeDefinitions([
      path.resolve(__dirname, '__fixtures__/js-flow-definitions')
    ]);

    ok(graph.get('fixture-package', 'ExternalUser'));
  });
});
