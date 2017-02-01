/* @flow */
import * as t from 'babel-types';
import {transform} from 'babel-plugin-flow-runtime';

import type {DependencyDict, ModuleDependencyDict, CrawledDependencies} from './crawlTypeDependencies';
import type {FlowModule} from './Graph';
import type {FlowConfig} from 'flow-config-parser';

type Node = {
  type: string;
};

export default function buildProgram (
  config: ?FlowConfig,
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
  const prelude = makePrelude(config);
  const block = [...prelude];
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

function makePrelude (config: ? FlowConfig) {
  const prelude = [];
  if (!config) {
    return prelude;
  }
  const suppressionTypeNames = config.get('suppress_type');
  if (suppressionTypeNames.length > 0) {
    const aliases = [];
    for (const typeName of suppressionTypeNames) {
      if (typeName === '$FlowFixMe') {
        continue; // skip the builtin
      }
      aliases.push(t.expressionStatement(
        t.callExpression(
          t.memberExpression(t.identifier('t'), t.identifier('declare')),
          [
            t.callExpression(
              t.memberExpression(t.identifier('t'), t.identifier('type')),
              [
                t.stringLiteral(typeName),
                t.callExpression(
                  t.memberExpression(t.identifier('t'), t.identifier('$flowFixMe')),
                  []
                )
              ]
            )
          ]
        )
      ));
    }
    if (aliases.length > 0) {
      prelude.push(t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier('t'))],
        t.stringLiteral('flow-runtime')
      ));
      prelude.push(...aliases);
    }
  }
  return prelude;
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