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
import type {FlowModule} from '../EntityGraph';

export const name = 'list-definitions';

export const description = 'Lists all the types found in definition files.';

export async function run (argv: Argv) {
  const config = await loadFlowConfig();
  const definitionFolders = getDefinitionFolders(config);
  const definitions = await crawlTypeDefinitions(definitionFolders);
  console.log(dumpModule(definitions));
};

function dumpModule (module: FlowModule, indent: number = 0): string {
  const lines = [
    module.name ? `Module: ${module.name}` : 'Global'
  ];

  let count = 0;

  for (const name in module.entities) {
    if (name !== 'module.exports') {
      count++;
    }
    lines.push(`  ${name}`);
  }

  for (const name in module.modules) {
    count++;
    lines.push(dumpModule(module.modules[name]));
  }

  if (count === 0) {
    return '';
  }

  return lines.filter(String).join('\n');
}

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
