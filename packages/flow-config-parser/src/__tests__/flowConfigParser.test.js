import {equal, deepEqual} from 'assert';
import parse from '../flowConfigParser';

describe('Flow Config Parser', function () {
  it('should parse a very sparse configuration', function () {

    const result = parse(`
      [ignore]
      node_modules/babel-cli/.*
      .*/__tests__/.*
      .*/src/\(foo\|bar\)/.*
      .*\.ignore\.js
      <PROJECT_ROOT>/__tests__/.*

      [include]
      interfaces

      [lib]

      [options]
      suppress_type=$FlowIssue
      suppress_comment=.*\@flowFixMe
      module.name_mapper= '^image![a-zA-Z0-9$_]+$' -> 'ImageStub'
      module.name_mapper.extension= 'css' -> '<PROJECT_ROOT>/CSSFlowStub.js.flow'
      munge_underscores=true
      server.max_workers=4

      [version]
      0.23.1
    `);


    equal(result.suppressesType('$FlowIssue'), true);
    equal(result.suppressesType('Boolean'), false);

    equal(result.suppressesComment('@flowFixMe this is broken'), true);
    equal(result.suppressesComment('Hello World'), false);

    equal(result.remapModule('bluebird'), 'bluebird');
    equal(result.remapModule('image!abc'), 'ImageStub');

    equal(result.get('munge_underscores'), true);

    equal(result.get('server.max_workers'), 4);

    equal(result.ignoresFile('./node_modules/babel-cli/foo.js'), true);
    equal(result.ignoresFile('./__tests__/foo.js'), true);
    equal(result.ignoresFile('./src/foo.js'), false);

    deepEqual(result.get('version'), ['0.23.1']);
  });
});