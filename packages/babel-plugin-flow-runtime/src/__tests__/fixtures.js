/* @flow */

import fs from 'fs';
import path from 'path';

const fixturesDir = path.join(__dirname, '__fixtures__');

function findFiles (dirname: string, filenames: string[]): string[] {
  for (const filename of fs.readdirSync(dirname)) {
    const qualified = path.join(dirname, filename);
    if (/\.js$/.test(filename)) {
      filenames.push(qualified.slice(fixturesDir.length + 1, -3));
    }
    else {
      const stat = fs.statSync(qualified);
      if (stat.isDirectory()) {
        findFiles(qualified, filenames);
      }
    }
  }
  return filenames;
}

const files = findFiles(fixturesDir, []);

export type Fixture = {
  input: string;
  expected: string;
  decorated?: string;
  combined?: string;
};

const fixtures: Map<string, Fixture> = new Map(files.map(filename => {
  // @flowIgnore
  return [filename, require(`./__fixtures__/${filename}`)];
}));

export default fixtures;