/* @flow */
import generate from 'babel-generator';
import {format} from 'prettier';
import path from 'path';

import crawlTypeDependencies from './crawlTypeDependencies';
import crawlTypeDefinitions from './crawlTypeDefinitions';
import loadFlowConfig from './loadFlowConfig';
import buildProgram from './buildProgram';

import type {FlowConfig} from 'flow-config-parser';

export default async function generateDefinitions (searchPaths: string[]) {

  const config = await loadFlowConfig();
  const definitionFolders = getDefinitionFolders(config);

  const prog = buildProgram(
    config,
    await crawlTypeDependencies(searchPaths),
    await crawlTypeDefinitions(definitionFolders)
  );

  const {code} = generate(prog);
  return format(code);
};


function getDefinitionFolders (config: ? FlowConfig): string[] {
  const dirnames = [path.resolve(__dirname, '..', 'flow-builtins')];
  if (config) {
    dirnames.push(...config.get('include'));
  }
  if (dirnames.length === 1) {
    dirnames.push('./flow-typed');
  }
  return dirnames;
}
