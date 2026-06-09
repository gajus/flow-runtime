/* @flow */

import {equal, ok} from 'assert';
import {fs} from '../util';
import generate from 'babel-generator';
import {format} from 'prettier';
import os from 'os';
import path from 'path';

import buildProgram from '../buildProgram';
import crawlTypeDefinitions from '../crawlTypeDefinitions';
import crawlTypeDependencies from '../crawlTypeDependencies';

const expected = `
import t from "flow-runtime";
t.declare(
  t.module("fixture-package", t => {
    t.declare(t.type("ExternalUser", t.object(t.property("name", t.string()))));
  })
);
`;

describe('JS Flow Package Definitions', () => {
  it('uses package index.js.flow definitions for imported package types', async () => {
    const workspace = await createPackageFixture();
    try {
      const dependencies = await crawlTypeDependencies([
        path.join(workspace, 'src')
      ]);
      const definitions = await crawlTypeDefinitions([
        path.join(workspace, 'node_modules')
      ]);

      ok(definitions.get('fixture-package', 'ExternalUser'));

      const code = format(generate(buildProgram(null, dependencies, definitions)).code);
      equal(code.trim(), expected.trim());
    }
    finally {
      await fs.unlinkAsync(path.join(workspace, 'node_modules/fixture-package/index.js'));
      await fs.unlinkAsync(path.join(workspace, 'node_modules/fixture-package/index.js.flow'));
      await fs.rmdirAsync(path.join(workspace, 'node_modules/fixture-package'));
      await fs.rmdirAsync(path.join(workspace, 'node_modules'));
      await fs.unlinkAsync(path.join(workspace, 'src/consumer.js'));
      await fs.rmdirAsync(path.join(workspace, 'src'));
      await fs.rmdirAsync(workspace);
    }
  });
});

async function createPackageFixture () {
  const workspace = await fs.mkdtempAsync(path.join(os.tmpdir(), 'flow-runtime-js-flow-'));
  const packageDir = path.join(workspace, 'node_modules/fixture-package');
  const sourceDir = path.join(workspace, 'src');

  await fs.mkdirAsync(path.join(workspace, 'node_modules'));
  await fs.mkdirAsync(packageDir);
  await fs.mkdirAsync(sourceDir);
  await fs.writeFileAsync(path.join(packageDir, 'index.js'), 'exports.value = true;');
  await fs.writeFileAsync(path.join(packageDir, 'index.js.flow'), `/* @flow */

export type ExternalUser = {
  name: string
};
`);
  await fs.writeFileAsync(path.join(sourceDir, 'consumer.js'), `/* @flow */

import type {ExternalUser} from 'fixture-package';

type LocalUser = {
  user: ExternalUser
};
`);

  return workspace;
}
