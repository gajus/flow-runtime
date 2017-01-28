/* @flow */

import parseFlowConfig from 'flow-config-parser';
import {fs} from './util';
import path from 'path';

export default async function loadFlowConfig (startDir: string = process.cwd()) {
  let dirname = startDir;
  while (dirname) {
    try {
      const filename = path.join(dirname, '.flowconfig');
      const stat = await fs.statAsync(filename);
      if (!stat.isDirectory()) {
        const content = await fs.readFileAsync(filename, 'utf8');
        return parseFlowConfig(content);
      }
    }
    catch (e) {
      // do nothing
    }
    const next = path.dirname(dirname);
    if (next === dirname) {
      return;
    }
    else {
      dirname = next;
    }
  }
}
