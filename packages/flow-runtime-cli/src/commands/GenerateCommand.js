/* @flow */
import generate from 'babel-generator';
import {format} from 'prettier';
import path from 'path';

import crawlTypeDependencies from '../crawlTypeDependencies';
import crawlTypeDefinitions from '../crawlTypeDefinitions';
import loadFlowConfig from '../loadFlowConfig';
import buildProgram from '../buildProgram';

import type {FlowConfig} from 'flow-config-parser';
import type {Argv} from '../';


export const name = 'generate';

export const description = 'Generates a flow-runtime type declaration module for the types used in the given files or folders.';

export async function run (argv: Argv) {
  const [, ...searchPaths] = argv._;

  const config = await loadFlowConfig();
  const definitionFolders = getDefinitionFolders(config);

  const prog = buildProgram(
    await crawlTypeDependencies(searchPaths),
    await crawlTypeDefinitions(definitionFolders)
  );

  const {code} = generate(prog);
  console.log(format(code));
};


function getDefinitionFolders (config: ? FlowConfig): string[] {
  const dirnames = [path.resolve(__dirname, '..', '..', 'flow-builtins')];
  if (config) {
    dirnames.push(...config.get('include'));
  }
  if (dirnames.length === 1) {
    dirnames.push('./flow-typed');
  }
  return dirnames;
}