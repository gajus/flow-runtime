/* @flow */

import fs from 'fs';
import path from 'path';

import type TypeContext from '../TypeContext';

const fixturesDir = path.join(__dirname, '__fixtures__');

const INCLUDE_PATTERN = process.env.TEST_FILTER
                   ? new RegExp(process.env.TEST_FILTER)
                   : null
                   ;

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

function filterIncluded (filename: string): boolean {
  if (INCLUDE_PATTERN) {
    return INCLUDE_PATTERN.test(filename);
  }
  else {
    return true;
  }
}

const files = findFiles(fixturesDir, []);

export type Fixture = {
  pass?: (t: TypeContext) => any;
  fail?: (t: TypeContext) => any;
};

const fixtures: Map<string, Fixture> = new Map(files.filter(filterIncluded).map(filename => {
  // @flowIgnore
  return [filename, require(`./__fixtures__/${filename}`)];
}));

export default fixtures;