/* @flow */

import {parse} from 'babylon';
import path from 'path';


type FileNode = {
  type: string;
  filename: string;
};

import {fs} from './util';

export default async function parseFile (filename: string): Promise<FileNode> {
  const input = await fs.readFileAsync(filename, 'utf8');
  const parsed = parse(input, {
    filename,
    sourceType: 'module',
    allowReturnOutsideFunction: true,
    plugins: [
      'jsx',
      'flow',
      'doExpressions',
      'objectRestSpread',
      'decorators',
      'classProperties',
      'exportExtensions',
      'asyncGenerators',
      'functionBind',
      'functionSent'
    ]
  });
  parsed.filename = path.resolve(filename);
  return parsed;
}
