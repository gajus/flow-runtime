/* @flow */

import traverse from 'babel-traverse';
import {findIdentifiers, getTypeParameters} from 'babel-plugin-flow-runtime';

import type Graph from './Graph';

import type {NodePath, Scope} from 'babel-traverse';

type Node = {
  type: string;
};


export default function collectTypeDeclarations (graph: Graph, file: Node) {
  const globalDeclarations = {};
  const modules = {};
  const moduleStack = [globalDeclarations];

  traverse(file, {
    'DeclareVariable|DeclareTypeAlias|DeclareFunction|DeclareClass|InterfaceDeclaration' (path: NodePath) {
      const namespace = moduleStack[moduleStack.length - 1];
      const id = path.get('id');
      namespace[id.node.name] = path.type;
    },

    DeclareModule: {
      enter (path: NodePath) {
        const id = path.get('id');
        const name = id.isStringLiteral() ? id.node.value : id.node.name;

        const moduleNamespace = {};
        modules[name] = moduleNamespace;
        moduleStack.push(moduleNamespace);
      },
      exit (path: NodePath) {
        moduleStack.pop();
      }
    }
  });

  return {globalDeclarations, modules};
}