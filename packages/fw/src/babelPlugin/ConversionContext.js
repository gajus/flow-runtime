/* @flow */


import * as t from 'babel-types';
import Entity from './Entity';
import type {EntityType} from './Entity';
import type {Node, NodePath} from 'babel-traverse';


export default class ConversionContext {

  libraryName: string = 'runtime-types';
  libraryId: string = 't';

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
   * Define a type alias with the given name and path.
   */
  defineTypeAlias (name: string, path: NodePath): Entity {
    return this.defineEntity(name, 'TypeAlias', path);
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
}