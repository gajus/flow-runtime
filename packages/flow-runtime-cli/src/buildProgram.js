/* @flow */
import * as t from 'babel-types';
import {transform} from 'babel-plugin-flow-runtime';

import type {DependencyDict, ModuleDependencyDict, CrawledDependencies} from './crawlTypeDependencies';
import type {FlowModule} from './EntityGraph';

type Node = {
  type: string;
};

export default function buildProgram (
  {globalDependencies, moduleDependencies}: CrawledDependencies,
  graph: FlowModule
): Node {
  const modules: Map<FlowModule, Object[]> = new Map();
  for (const vertex of graph.traverse(...toKeys(globalDependencies, moduleDependencies))) {
    if (vertex.path && vertex.path.type !== 'TypeParameter') {
      const {node} = vertex.path;
      const existing = modules.get(vertex.parent);
      if (existing) {
        existing.push(node);
      }
      else {
        modules.set(vertex.parent, [node]);
      }
    }
  }
  const block = [];
  for (const [mod, items] of modules) {
    if (mod.name) {
      block.push(
        t.declareModule(t.stringLiteral(mod.name), t.blockStatement(items))
      );
    }
    else {
      block.push(...items);
    }
  }
  const prog = t.file(t.program(block));
  transform(prog);
  return prog;
}

function toKeys (globalDependencies: DependencyDict, moduleDependencies: ModuleDependencyDict): Array<string | string[]> {
  const keys = Object.keys(globalDependencies);
  for (const moduleName in moduleDependencies) {
    const module = moduleDependencies[moduleName];
    for (const key in module) {
      keys.push([moduleName, key]);
    }
  }
  return keys;
}