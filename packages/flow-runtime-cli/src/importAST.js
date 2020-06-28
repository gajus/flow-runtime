/* @flow */

import traverse from '@babel/traverse';
import * as t from '@babel/types';
import {findIdentifiers, getTypeParameters} from 'babel-plugin-flow-runtime';
import shouldIgnoreType from './shouldIgnoreType';

import type {NodePath, Scope} from '@babel/traverse';
import type {FlowModule, FlowEntity} from './Graph';

type Node = {
  type: string;
};


export default function importAST (graph: FlowModule, file: Node) {
  const nodeTypeParameters = new WeakMap();

  const moduleStack = [graph];

  function currentModule (): FlowModule {
    return moduleStack[moduleStack.length - 1];
  }

  function getDefinition (id: NodePath): ? FlowEntity {
    const {name} = id.node;
    if (shouldIgnoreType(name)) {
      return;
    }
    const fromScope = id.scope.getData(`entityDefinition:${name}`);
    if (fromScope) {
      return fromScope;
    }
    let parent = id.parentPath;
    while (parent && parent.node) {
      const typeParameters = nodeTypeParameters.get(parent.node);
      if (typeParameters) {
      }
      if (typeParameters && typeParameters[id.node.name]) {
        return typeParameters[id.node.name];
      }
      parent = parent.parentPath;
    }
  }

  function registerTypeParameter (id: NodePath, owner: NodePath): FlowEntity {
    let items = nodeTypeParameters.get(owner.node);
    if (!items) {
      items = {};
      nodeTypeParameters.set(owner.node, items);
    }
    const vertex = currentModule().getEntityForPath(id);
    items[id.node.name] = vertex;
    return vertex;
  }

  function registerDefinition (path: NodePath, scope: Scope = path.scope): FlowEntity {
    const shouldDeclare = (
         path.type === 'DeclareVariable'
      || path.type === 'DeclareClass'
      || path.type === 'DeclareFunction'
      || path.type === 'DeclareModuleExports'
      || path.type === 'DeclareTypeAlias'
      || path.parentPath.type === 'ImportDeclaration'
      || path.parentPath.type === 'ImportDefaultDeclaration'
      || path.parentPath.type === 'ImportNamespaceDeclaration'
    );
    const current = currentModule();
    const vertex = shouldDeclare
                 ? current.register(path)
                 : current.getEntityForPath(path)
                 ;
    if (!path.isDeclareModuleExports()) {
      const id = path.isIdentifier() ? path : path.get('id');
      scope.setData(`entityDefinition:${id.node.name}`, vertex);
    }
    const typeParameters = getTypeParameters(path);
    if (typeParameters.length > 0) {
      for (const typeParameter of typeParameters) {
        registerTypeParameter(typeParameter, path);
      }
    }
    return vertex;
  }

  function resolvePossiblyQualified (path: NodePath): NodePath {
    let subject = path;
    while (subject.type === 'QualifiedTypeIdentifier') {
      subject = subject.get('qualification');
    }
    return subject;
  }


  // First pass, collect value and type definitions
  traverse(file, {
    ImportDeclaration (path: NodePath) {
      for (const specifier of path.get('specifiers')) {
        const source = path.get('source').node.value;
        const local = specifier.get('local');
        const {name} = local.node;
        const vertex = registerDefinition(local);
        const imported = specifier.isImportDefaultSpecifier()
                       ? name
                       : specifier.get('imported').node.name
                       ;
        vertex.addDependency(graph.ref(source, imported));
      }
    },
    ExportNamedDeclaration (path: NodePath) {
      if (path.node.declare) {
        // this is not a real export, it's a DeclareExportDeclaration
        // which babylon doesn't support
        registerDefinition(path.get('declaration'));
      }
    },
    TypeParameter (path: NodePath) {
      registerTypeParameter(path, path.parentPath.parentPath);
    },

    'DeclareTypeAlias|DeclareFunction|DeclareClass' (path: NodePath) {
      registerDefinition(path);
    },

    DeclareVariable (path: NodePath) {
      if (moduleStack.length > 1 && path.node.id.name === 'exports') {
        // Legacy feature of flow - module.exports simulated by just declaring
        // a var called exports in a module.
        // If we have no `DeclareExportDeclaration`s and no `DeclareModuleExports`,
        // convert this to a `DeclareModuleExports`
        const block = path.parentPath;
        if (block && block.isBlockStatement()) {
          let candidate = true;
          for (const sibling of block.get('body')) {
            if (sibling.node === path.node) {
              continue;
            }
            else if (sibling.isExportNamedDeclaration() || sibling.isDeclareModuleExports()) {
              candidate = false;
              break;
            }
          }
          if (candidate) {
            const replacement = t.declareModuleExports(path.node.id.typeAnnotation);
            path.replaceWith(replacement);
            return;
          }
        }

      }
      registerDefinition(path);
    },

    DeclareModule: {
      enter (path: NodePath) {
        const id = path.get('id');
        const name = id.isStringLiteral() ? id.node.value : id.node.name;

        const child = currentModule().registerModule(path);
        moduleStack.push(child);
      },
      exit (path: NodePath) {
        moduleStack.pop();
      }
    },

    DeclareModuleExports (path: NodePath) {
      registerDefinition(path);
    },

    TypeAlias (path: NodePath) {
      registerDefinition(path);
      for (const typeParameter of getTypeParameters(path)) {
        registerTypeParameter(typeParameter, path);
      }
    },
    InterfaceDeclaration (path: NodePath) {
      registerDefinition(path);
      for (const typeParameter of getTypeParameters(path)) {
        registerTypeParameter(typeParameter, path);
      }
    },
    VariableDeclarator (path: NodePath) {
      for (const id of findIdentifiers(path.get('id'))) {
        registerDefinition(id);
      }
    },
    Function (path: NodePath) {
      for (const typeParameter of getTypeParameters(path)) {
        registerTypeParameter(typeParameter, path);
      }
      if (path.isFunctionDeclaration() && path.has('id')) {
        registerDefinition(path, path.parentPath.scope);
      }

      for (const id of findIdentifiers(path.get('params'))) {
        registerDefinition(id);
      }
    },
    Class (path: NodePath) {
      for (const typeParameter of getTypeParameters(path)) {
        registerTypeParameter(typeParameter, path);
      }
      if (path.isClassDeclaration() && path.has('id')) {
        registerDefinition(path);
      }
    }
  });

  // Now walk through the graph, connecting edges
  traverse(file, {
    InterfaceExtends (path: NodePath) {
      const id = resolvePossiblyQualified(path.get('id'));
      const {name} = id.node;
      const definition = getDefinition(id);
      const subject = path.parentPath;
      const vertex = currentModule().getEntityForPath(subject);
      if (definition) {
        vertex.addDependency(definition);
      }
      else {
        vertex.addDependency(graph.ref(name));
      }
    },
    GenericTypeAnnotation (path: NodePath) {
      const id = resolvePossiblyQualified(path.get('id'));
      const {name} = id.node;
      const definition = getDefinition(id);
      let subject = findContainingPath(path);
      if (!subject) {
        console.warn('could not find a corresponding subject for node: ', path.node);
        return;
      }

      const vertex = currentModule().getEntityForPath(subject);
      if (definition) {
        vertex.addDependency(definition);
      }
      else {
        vertex.addDependency(graph.ref(name));
      }
    }
  });

  return graph;
}

function findContainingPath (path: NodePath): ? NodePath {
  let child = path;
  let parent = path.parentPath;
  while (parent) {
    const isFlowDeclaration = (
         parent.type === 'DeclareVariable'
      || parent.type === 'DeclareClass'
      || parent.type === 'DeclareModule'
      || parent.type === 'DeclareModuleExports'
      || parent.type === 'DeclareFunction'
      || parent.type === 'DeclareTypeAlias'
      || parent.type === 'InterfaceDeclaration'
      || parent.type === 'TypeAlias'
      || parent.type === 'TypeCastExpression'
    );
    if (isFlowDeclaration) {
      return parent;
    }
    else if (parent.isImportDefaultSpecifier() || parent.isImportNamespaceSpecifier() || path.isImportSpecifier()) {
      return child;
    }
    else if (parent.isStatement()) {
      return parent;
    }
    else {
      child = parent;
      parent = parent.parentPath;
    }
  }
}
