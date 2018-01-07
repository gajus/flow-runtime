/* @flow */

import findFiles from './findFiles';
import parseFileWithFlow from './parseFileWithFlow';
import {FlowModule} from './Graph';
import importAST from './importAST';


export default async function crawlTypeDefinitions (searchPaths: string[]): Promise<FlowModule> {
  const filenames = await findFiles(...searchPaths);
  const files = await Promise.all(filenames.map(parseFileWithFlow));

  const graph = new FlowModule();

  for (const file of files) {
    importAST(graph, file);
  }
  return graph;
}
