/* @flow */


import * as t from '@babel/types';
import Entity from './Entity';
import type {EntityType} from './Entity';
import type {Node, NodePath} from '@babel/traverse';


const tdzIdentifiers: WeakSet<Node> = new WeakSet();

const FLOW_TYPENAMES = {
  $Exact: '$exact',
  $Diff: '$diff',
  $Keys: '$keys',
  $ObjMapi: '$objMapi',
  $ObjMap: '$objMap',
  $PropertyType: '$propertyType',
  $Shape: '$shape',
  $Subtype: '$subtype',
  $Supertype: '$supertype',
  $TupleMap: '$tupleMap',
  $Values: '$values',
  Class: 'Class'
};

export default class ConversionContext {

  libraryName: string = 'flow-runtime';
  libraryId: string = 't';
  shouldImport: boolean = true;
  shouldAssert: boolean = true;
  shouldWarn: boolean = false;
  shouldAnnotate: boolean = true;
  optInOnly: boolean = false;
  isAnnotating: boolean = false;
  suppressCommentPatterns: RegExp[] = [/\$FlowFixMe/];
  suppressTypeNames: string[] = ['$FlowFixMe'];
  lastImportDeclaration: ?NodePath = null;

  /**
   * A set of nodes that have already been visited.
   */
  visited: WeakSet<Node> = new WeakSet();

  /**
   * Mark a particular node (an Identifier) as boxed.
   * Only applies to identifiers.
   * Boxed identifiers are wrapped in `t.box()` to avoid
   * Temporal Dead Zone issues.
   */
  markTDZIssue (node: Node) {
    tdzIdentifiers.add(node);
  }

  /**
   * Determine whether the given node exists in a
   * temporal dead zone.
   */
  inTDZ (node: Node): boolean {
    return tdzIdentifiers.has(node);
  }

  /**
   * Define a type alias with the given name and path.
   */
  defineTypeAlias (name: string, path: NodePath): Entity {
    return this.defineEntity(name, 'TypeAlias', path);
  }

  /**
   * Define a type alias with the given name and path.
   */
  defineImportedType (name: string, path: NodePath): Entity {
    return this.defineEntity(name, 'ImportedType', path);
  }

  /**
   * Define a type parameter with the given name and path.
   */
  defineTypeParameter (name: string, path: NodePath): Entity {
    return this.defineEntity(name, 'TypeParameter', path);
  }

  /**
   * Define a class type parameter with the given name and path.
   */
  defineClassTypeParameter (name: string, path: NodePath): Entity {
    return this.defineEntity(name, 'ClassTypeParameter', path);
  }

  /**
   * Define a value with the given name and path.
   */
  defineValue (name: string, path: NodePath): Entity {
    return this.defineEntity(name, 'Value', path);
  }

  /**
   * Determines whether the given node path should be ignored
   * based on its comments.
   */
  shouldSuppressPath (path: NodePath) {
    const comments = getPathComments(path);
    for (const pattern of this.suppressCommentPatterns) {
      for (const comment of comments) {
        if (pattern.test(comment)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Determine whether we should suppress types with the given name.
   */
  shouldSuppressTypeName (name: string): boolean {
    return this.suppressTypeNames.indexOf(name) !== -1;
  }

  /**
   * Determine whether the given identifier has TDZ issues.
   * e.g. referencing a `TypeAlias` before it has been defined.
   */
  hasTDZIssue (name: string, path: NodePath): boolean {
    const existingEntity = this.getEntity(name, path);
    if (existingEntity) {
      // We have an entity but we don't know whether it clashes
      // with another entity in this scope that hasn't been defined yet.
      const existingFunctionParent = existingEntity.path && existingEntity.path.getFunctionParent();
      const functionParent = path.getFunctionParent();
      if (existingEntity.scope === path.scope) {
        // if the scopes are identical this cannot clash.
        return false;
      }
      else if (existingFunctionParent && functionParent && existingFunctionParent.node === functionParent.node) {
        // flow doesn't allow block scoped type aliases
        // so if the scopes are in the same function this must be
        // an identical reference
        return false;
      }
      else {
        // We need to see if any of the block statements
        // between this node and the existing entity have
        // unvisited type aliases that override the entity we're looking at.
        return existingEntity.isGlobal
             ? this.hasForwardTypeDeclaration(name, path)
             : existingEntity.path
               ? this.hasForwardTypeDeclaration(name, path, existingEntity.path.findParent(filterBlockParent))
               : false
             ;
      }
    }
    else {
      // There's no entity defined with that name yet
      return this.hasForwardTypeDeclaration(name, path);
    }
  }

  /**
   * Find a named type declaration which occurs "after" the `startPath`.
   */
  hasForwardTypeDeclaration (name: string, startPath: NodePath, endBlockPath?: NodePath): boolean {
    let subject = startPath.getStatementParent();
    let block = subject.parentPath;
    let body;
    while (block !== endBlockPath) {
      while (block && (!block.isBlockStatement() && !block.isProgram())) {
        subject = block;
        block = subject.parentPath;
      }
      if (!block || block === endBlockPath) {
        return false;
      }
      body = block.get('body');
      for (let i = subject.key + 1; i < body.length; i++) {
        let path = body[i];
        if (path.isExportNamedDeclaration() || path.isExportDefaultDeclaration()) {
          if (!path.has('declaration')) {
            continue;
          }
          path = path.get('declaration');
        }
        const hasSameName = path.node.id && path.node.id.name === name;
        const isDeclaration = (
             path.type === 'TypeAlias'
          || path.type === 'InterfaceDeclaration'
          || path.type === 'FunctionDeclaration'
          || path.type === 'ClassDeclaration'
        );
        if (hasSameName && isDeclaration) {
          return true;
        }
      }
      if (block.isProgram()) {
        // nothing left to do
        return false;
      }
      subject = block.getStatementParent();
      block = subject.parentPath;
    }
    return false;
  }

  /**
   * Define an entity with the given name, type and path.
   */
  defineEntity (name: string, type: EntityType, path: NodePath): Entity {
    const entity = new Entity();
    entity.name = name;
    entity.path = path;
    entity.type = type;
    path.scope.setData(`Entity:${name}`, entity);
    return entity;
  }

  /**
   * Get an entity with the given name in the given path.
   */
  getEntity (name: string, path: NodePath): ? Entity {
    return path.scope.getData(`Entity:${name}`);
  }

  /**
   * Get a named symbol from the library.
   */
  symbol (name: string): Node {
    return t.memberExpression(
      t.identifier(this.libraryId),
      t.identifier(`${name}Symbol`)
    );
  }

  /**
   * Returns a `CallExpression` node invoking the given named method
   * on the runtime library, passing in the given arguments.
   */
  call (name: string, ...args: Node[]): Node {
    return t.callExpression(
      t.memberExpression(
        t.identifier(this.libraryId),
        t.identifier(name)
      ),
      args
    );
  }

  /**
   * Call `type.assert(...args)` on the given node, or `t.warn(type, ...args)`
   * if `shouldWarn` is true.
   */
  assert (subject: Node, ...args: Node[]): Node {
    if (this.shouldWarn) {
      return this.call('warn', subject, ...args);
    }
    else {
      return t.callExpression(
        t.memberExpression(
          subject,
          t.identifier('assert')
        ),
        args
      );
    }
  }

  /**
   * Replace the given path with a node,
   * and ensure the node won't be visited again.
   */
  replacePath (path: NodePath, replacement: Node) {
    this.visited.add(replacement);
    path.replaceWith(replacement);
  }

  getClassData (path: NodePath, key: string): any {
    const candidates = path.scope.getData(`classData:${key}`);
    if (candidates instanceof Map) {
      const declaration = path.isClass()
                        ? path
                        : path.findParent(item => item.isClass())
                        ;

      if (declaration) {
        return candidates.get(declaration.node);
      }
      else {
        console.warn('Could not find class declaration to get data from:', key);
      }
    }
  }

  setClassData (path: NodePath, key: string, value: any) {
    const {scope} = path;
    const qualifiedKey = `classData:${key}`;
    const declaration = path.isClass()
                      ? path
                      : path.findParent(item => item.isClass())
                      ;
    if (!declaration) {
      console.warn('Could not find class declaration to set data on:', key);
      return;
    }

    let map = scope.data[qualifiedKey];
    if (!(map instanceof Map)) {
      map = new Map();
      scope.data[qualifiedKey] = map;
    }

    map.set(declaration.node, value);
  }

  getFlowTypeName (name: string): ? string {
    return FLOW_TYPENAMES[name];
  }
}

function filterBlockParent (item: NodePath): NodePath {
  return item.isBlockStatement() || item.isProgram();
}

function getPathComments (path: NodePath): string[] {
  //"leadingComments", "trailingComments", "innerComments"
  const comments = [];
  if (path.node.comments) {
    for (const comment of path.node.comments) {
      comments.push(comment.value || '');
    }
  }
  if (path.node.leadingComments) {
    for (const comment of path.node.leadingComments) {
      comments.push(comment.value || '');
    }
  }
  if (path.node.innerComments) {
    for (const comment of path.node.innerComments) {
      comments.push(comment.value || '');
    }
  }
  return comments;
}
