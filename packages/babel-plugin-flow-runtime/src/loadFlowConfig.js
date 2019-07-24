/* @flow */

import parseFlowConfig from 'flow-config-parser';
import fs from 'fs';
import path from 'path';

export default function loadFlowConfig (startDir: string = process.cwd()) {
  let dirname = startDir;
  while (dirname) {
    try {
      const filename = path.join(dirname, '.flowconfig');
      const stat = fs.statSync(filename);
      if (stat.isFile()) {
        const content = fs.readFileSync(filename, 'utf8');
        return parseFlowConfig(content);
      }
    }
    catch (e) {
      // do nothing
    }
    const next = path.dirname(dirname);
    if (next === dirname) {
      return false;
    }
    else {
      dirname = next;
    }
  }
}
