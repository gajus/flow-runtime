/* @flow */

import {fs} from './util';
import path from 'path';

export default async function findFiles (...input: string[]): Promise<string[]> {
  const found = [];
  for (const item of input) {
    try {
      await collectFiles(item, found);
    } catch ( err ) {
      console.error(`Ignore files from ${item}: ${err}`);
    }
  }
  return found;
}

async function collectFiles (fileOrDir: string, collected: string[]): Promise<string[]> {
  const stat = await fs.statAsync(fileOrDir);
  if (stat.isDirectory()) {
    for (const item of await fs.readdirAsync(fileOrDir)) {
      await collectFiles(path.join(fileOrDir, item), collected);
    }
  }
  else if (collected.indexOf(fileOrDir) === -1 && /\.js(x|m)?$/.test(fileOrDir)) {
    collected.push(fileOrDir);
  }
  return collected;
}
