/* @flow */


import * as t from 'babel-types';
import Entity from './Entity';
import type {EntityType} from './Entity';
import type {Node, NodePath} from 'babel-traverse';


const boxedIdentifiers: WeakSet<Node> = new WeakSet();

export default class ConversionContext {

  libraryName: string = 'flow-runtime';
  libraryId: string = 't';
  shouldImport: boolean = true;
  shouldAssert: boolean = true;
  shouldWarn: boolean = false;
  shouldDecorate: boolean = true;

  /**
   * A map of global entity definitions.
   * This is used to represent references to known global identifiers
   * such as `Array`, `RegExp` etc.
   */
  globalEntities: Map<string, Entity> = new Map();

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
  markBoxed (node: Node) {
    boxedIdentifiers.add(node);
  }

  /**
   * Determine whether the given node should be boxed.
   */
  isBoxed (node: Node): boolean {
    return boxedIdentifiers.has(node);
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
             : this.hasForwardTypeDeclaration(name, path, existingEntity.path.findParent(filterBlockParent))
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
        const path = body[i];
        if (path.isTypeAlias() || path.isInterfaceDeclaration()) {
          if (path.node.id.name === name) {
            return true;
          }
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
    let entity = path.scope.getData(`Entity:${name}`);
    if (entity) {
      return entity;
    }
    entity = this.globalEntities.get(name);
    if (entity) {
      return entity;
    }
    if (global[name]) {
      entity = new Entity();
      entity.name = name;
      entity.type = 'Value';
      this.globalEntities.set(name, entity);
      return entity;
    }
    else {
      return null;
    }
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
}

function filterBlockParent (item: NodePath): NodePath {
  return item.isBlockStatement() || item.isProgram();
}