/* @flow */

const dedent = require('dedent');
const fixtures = require('../lib/__tests__/fixtures').default;

const simple = Array.from(fixtures).reduce((items, fixture) => {
  items.push([fixture[0], dedent(fixture[1].input).trim()]);
  return items;
}, []);

console.log(JSON.stringify(simple, null, 2));