/* @flow */

import * as t from '@babel/types';

import findFiles from './findFiles';
import parseFileWithFlow from './parseFileWithFlow';
import {FlowModule} from './Graph';
import importAST from './importAST';


export default async function crawlTypeDefinitions (searchPaths: string[], packages: {[name: string]: string} = {}): Promise<FlowModule> {
  const filenames = await findFiles(...searchPaths);
  const files = await Promise.all(filenames.map(parseFileWithFlow));

  const graph = new FlowModule;

  for (const file of files) {
    importAST(graph, file);
  }
  for (const name of Object.keys(packages)) {
    const file = await parseFileWithFlow(packages[name]);
    const aliases = file.program.body.reduce((result, node) => {
      const alias = node.type === 'ExportNamedDeclaration' ? node.declaration : node;
      if (alias && alias.type === 'TypeAlias') {
        result.push(t.declareTypeAlias(alias.id, alias.typeParameters, alias.right));
      }
      return result;
    }, []);
    if (aliases.length > 0) {
      importAST(graph, t.file(t.program([t.declareModule(t.stringLiteral(name), t.blockStatement(aliases))])));
    }
  }
  return graph;
}
