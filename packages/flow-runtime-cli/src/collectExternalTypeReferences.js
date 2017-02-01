/* @flow */

import traverse from 'babel-traverse';
import {findIdentifiers, getTypeParameters} from 'babel-plugin-flow-runtime';

import shouldIgnoreType from './shouldIgnoreType';
import type {NodePath, Scope} from 'babel-traverse';

type Node = {
  type: string;
};

const nodeTypeParameters = new WeakMap();

export default function collectExternalTypeReferences (file: Node) {
  const importedTypes = {};
  const globalTypes = {};

  // First pass, collect value and type definitions
  traverse(file, {
    TypeAlias (path: NodePath) {
      registerDefinition(path.get('id'), 'type');
      for (const typeParameter of getTypeParameters(path)) {
        registerTypeParameter(typeParameter, path);
      }
    },
    InterfaceDeclaration (path: NodePath) {
      registerDefinition(path.get('id'), 'type');
      for (const typeParameter of getTypeParameters(path)) {
        registerTypeParameter(typeParameter, path);
      }
    },
    ImportDeclaration (path: NodePath) {
      path.get('specifiers').forEach(specifier => {
        const local = specifier.get('local');
        if (path.node.importKind === 'type') {
          registerDefinition(local, 'importedType');
        }
        else {
          registerDefinition(local, 'value');
        }
      });
    },
    VariableDeclarator (path: NodePath) {
      for (const id of findIdentifiers(path.get('id'))) {
        registerDefinition(id, 'value');
      }
    },
    Function (path: NodePath) {
      if (path.isFunctionDeclaration() && path.has('id')) {
        registerDefinition(path.get('id'), 'value', path.parentPath.scope);
      }

      for (const id of findIdentifiers(path.get('params'))) {
        registerDefinition(id, 'value');
      }
      for (const typeParameter of getTypeParameters(path)) {
        registerTypeParameter(typeParameter, path);
      }
    },
    Class (path: NodePath) {
      if (path.isClassDeclaration() && path.has('id')) {
        registerDefinition(path.get('id'), 'value', path.parentPath.scope);
      }

      for (const typeParameter of getTypeParameters(path)) {
        registerTypeParameter(typeParameter, path);
      }
    }
  });

  traverse(file, {
    ImportDeclaration (path: NodePath) {
      path.get('specifiers').forEach(specifier => {
        const source = path.get('source').node.value;
        const local = specifier.get('local');
        const {name} = local.node;
        if (path.node.importKind === 'type') {
          const isDefault = specifier.isImportDefaultSpecifier();
          const isNamespace = !isDefault && specifier.isImportNamespaceSpecifier();
          const imported = isDefault || isNamespace
                         ? name
                         : specifier.get('imported').node.name
                         ;
          importedTypes[name] = {
            imported,
            source,
            isDefault,
            isNamespace
          };
        }
      });
    },
    GenericTypeAnnotation (path: NodePath) {
      const id = path.get('id');
      const {name} = id.node;
      const kind = getDefinitionKind(id);
      if (!kind && !shouldIgnoreType(name)) {
        if (globalTypes[name]) {
          globalTypes[name]++;
        }
        else {
          globalTypes[name] = 1;
        }
      }
    }
  });

  return {importedTypes, globalTypes};
}



function getDefinitionKind (id: NodePath): ? 'value' | 'type' | 'importedType' | 'typeParameter' {
  const fromScope = id.scope.getData(`entityKind:${id.node.name}`);
  if (fromScope) {
    return fromScope;
  }
  let parent = id.parentPath;
  while (parent && parent.node) {
    const typeParams = nodeTypeParameters.get(parent.node);
    if (typeParams && typeParams[id.node.name]) {
      return 'typeParameter';
    }
    parent = parent.parentPath;
  }
}

function registerTypeParameter (id: NodePath, owner: NodePath) {
  let items = nodeTypeParameters.get(owner.node);
  if (!items) {
    items = {};
    nodeTypeParameters.set(owner.node, items);
  }
  items[id.node.name] = true;
}

function registerDefinition (id: NodePath, kind: 'value' | 'type' | 'importedType', scope: Scope = id.scope) {
  scope.setData(`entityKind:${id.node.name}`, kind);
}