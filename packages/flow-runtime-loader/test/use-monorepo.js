'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');

const root = path.resolve(process.env.FLOW_RUNTIME_SOURCE_ROOT || '');
assert.equal(path.dirname(root), os.tmpdir());
assert.ok(path.basename(root).startsWith('flow-runtime-source-'));

// Redirect package entry points to real, source-built modules, not test doubles.
for (const name of ['flow-config-parser', 'babel-plugin-flow-runtime', 'flow-runtime']) {
  const built = require.resolve(path.join(root, 'node_modules', name));
  require(built);
  require.cache[require.resolve(name)] = require.cache[built];
  assert.equal(require.cache[require.resolve(name)].filename, built);
}
