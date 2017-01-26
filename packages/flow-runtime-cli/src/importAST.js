/* @flow */

import traverse from 'babel-traverse';
import * as t from 'babel-types';
import {findIdentifiers, getTypeParameters} from 'babel-plugin-flow-runtime';

import type {NodePath, Scope} from 'babel-traverse';
import type Graph, {Vertex} from './Graph';

type Node = {
  type: string;
};


export default function importAST (graph: Graph, file: Node) {
  const nodeTypeParameters = new WeakMap();
  const importedTypes = {};
  const globalTypes = {};

  const moduleStack = [graph.collection];


  function getDefinition (id: NodePath): ? Vertex {
    const fromScope = id.scope.getData(`entityDefinition:${id.node.name}`);
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

  function registerTypeParameter (id: NodePath, owner: NodePath): Vertex {
    let items = nodeTypeParameters.get(owner.node);
    if (!items) {
      items = {};
      nodeTypeParameters.set(owner.node, items);
    }
    const vertex = graph.getVertex(id);
    items[id.node.name] = vertex;
    return vertex;
  }

  function registerDefinition (path: NodePath, scope: Scope = path.scope): Vertex {
    const shouldDeclare = (
         path.type === 'DeclareVariable'
      || path.type === 'DeclareClass'
      || path.type === 'DeclareFunction'
      || path.type === 'DeclareModuleExports'
      || path.type === 'DeclareTypeAlias'
    );
    const currentModule = moduleStack[moduleStack.length - 1];
    const vertex = shouldDeclare
                 ? currentModule.register(path)
                 : graph.getVertex(path)
                 ;
    if (!path.isDeclareModuleExports()) {
      const id = path.isIdentifier() ? path : path.get('id');
      scope.setData(`entityDefinition:${id.node.name}`, vertex);
    }
    if (currentModule.vertex) {
      vertex.createEdge(currentModule.vertex);
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
      path.get('specifiers').forEach(specifier => {
        const source = path.get('source').node.value;
        const local = specifier.get('local');
        const {name} = local.node;
        const vertex = registerDefinition(local);
        const imported = specifier.isImportDefaultSpecifier()
                       ? name
                       : specifier.get('imported').node.name
                       ;
        vertex.createEdge(graph.ref(source, imported));
      });
    },
    ExportNamedDeclaration (path: NodePath) {
      if (path.node.declare) {
        registerDefinition(path.get('declaration'));
      }
    },

    'DeclareVariable|DeclareTypeAlias|DeclareFunction|DeclareClass' (path: NodePath) {
      registerDefinition(path);
    },

    TypeParameter (path: NodePath) {
      registerTypeParameter(path, path.parentPath.parentPath);
    },

    DeclareModule: {
      enter (path: NodePath) {
        const id = path.get('id');
        const name = id.isStringLiteral() ? id.node.value : id.node.name;

        const collection = moduleStack[moduleStack.length - 1].registerCollection(path);
        moduleStack.push(collection);
      },
      exit (path: NodePath) {
        moduleStack.pop();
      }
    },

    DeclareModuleExports (path: NodePath) {
      const vertex = registerDefinition(path);
      const parent = graph.getVertex(path.findParent(item => item.isDeclareModule()));
      parent.createEdge(vertex);
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
        registerDefinition(path.get('id'), path.parentPath.scope);
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
    ImportDeclaration (path: NodePath) {
      path.get('specifiers').forEach(specifier => {
        const source = path.get('source').node.value;
        const local = specifier.get('local');
        const {name} = local.node;
        const imported = specifier.isImportDefaultSpecifier()
                       ? name
                       : specifier.get('imported').node.name
                       ;
        if (path.node.importKind === 'type') {
          importedTypes[name] = {
            imported,
            source
          };
        }
      });
    },
    InterfaceExtends (path: NodePath) {
      const id = resolvePossiblyQualified(path.get('id'));
      const {name} = id.node;
      const definition = getDefinition(id);
      const subject = path.parentPath;
      const vertex = graph.getVertex(subject);
      if (definition) {
        vertex.createEdge(definition);
      }
      else {
        if (globalTypes[name]) {
          globalTypes[name]++;
        }
        else {
          globalTypes[name] = 1;
        }
        vertex.createEdge(graph.ref(name));
      }
    },
    GenericTypeAnnotation (path: NodePath) {
      const id = resolvePossiblyQualified(path.get('id'));
      const {name} = id.node;
      const definition = getDefinition(id);
      let subject = path.findParent(parent => {
        return (
             parent.type === 'DeclareVariable'
          || parent.type === 'DeclareClass'
          || parent.type === 'DeclareModule'
          || parent.type === 'DeclareModuleExports'
          || parent.type === 'DeclareFunction'
          || parent.type === 'DeclareTypeAlias'
          || parent.type === 'InterfaceDeclaration'
          || parent.type === 'TypeAlias'
          || parent.type === 'TypeCastExpression'
          || !parent.isFlow()
        );
      });
      if (!subject) {
        console.warn('could not find a corresponding subject for node: ', path.node);
        return;
      }
      if (subject.isDeclareModuleExports()) {
        subject = subject.parentPath.parentPath;
      }
      else if (subject.isRestElement()) {
        subject = subject.parentPath();
      }
      else if (subject.isIdentifier() || subject.isArrayPattern() || subject.isObjectPattern()) {
        let parentPath = subject.parentPath;
        if (parentPath.isAssignmentPattern()) {
          parentPath = parentPath.parentPath;
        }
        if (parentPath.isFunction() && subject.key !== 'body') {
          subject = parentPath;
        }
      }
      const vertex = graph.getVertex(subject);
      if (definition) {
        vertex.createEdge(definition);
      }
      else {
        if (globalTypes[name]) {
          globalTypes[name]++;
        }
        else {
          globalTypes[name] = 1;
        }
        vertex.createEdge(graph.ref(name));
      }
    }
  });

  return {importedTypes, globalTypes};

}