/* @flow */

import Deque from 'double-ended-queue';

import type {NodePath} from 'babel-traverse';

type Node = {
  type: string;
};

type FlowEntityDict = {
  [name: string]: FlowEntity;
};

type FlowModuleDict = {
  [name: string]: FlowModule
};

const nodeEntities: WeakMap<Node, FlowEntity> = new WeakMap();


export class FlowModule {
  name: ? string;
  parent: ? FlowModule;
  entities: FlowEntityDict = {};
  modules: FlowModuleDict = {};

  get (...keys: string[]): ? FlowEntity {
    const depth = keys.length - 1;
    let module = this;
    for (let i = 0; i < depth; i++) {
      module = module.modules[keys[i]];
      if (!module) {
        return;
      }
    }
    return module.entities[keys[depth]];
  }

  register (path: NodePath): FlowEntity {
    const entity = this.getEntityForPath(path);
    if (entity.name) {
      this.entities[entity.name] = entity;
    }
    return entity;
  }

  registerModule (path: NodePath): FlowModule {
    const id = path.get('id');
    const name = id.isIdentifier() ? id.node.name : id.node.value;
    const existing = this.modules[name];
    if (existing) {
      return existing;
    }
    else {
      const child = new FlowModule();
      child.name = name;
      child.parent = this;
      this.modules[name] = child;
      return child;
    }
  }

  getEntityForPath (path: NodePath): FlowEntity {
    const {node} = path;
    const existing = nodeEntities.get(node);
    if (existing) {
      return existing;
    }
    else {
      const entity = new FlowEntity();
      if (path.has('id')) {
        entity.name = path.get('id').node.name;
      }
      else if (path.isDeclareModuleExports()) {
        entity.name = 'module.exports';
      }
      else {
        entity.name = path.node.name;
      }
      entity.path = path;
      entity.parent = this;
      nodeEntities.set(path.node, entity);
      return entity;
    }
  }

  ref (...keys: string[]): FlowEntity {
    const depth = keys.length - 1;
    let module = this;
    for (let i = 0; i < depth; i++) {
      const key = keys[i];
      const existing = module.modules[key];
      if (existing) {
        module = existing;
      }
      else {
        const child = new FlowModule();
        child.name = key;
        child.parent = module;
        module.modules[key] = child;
        module = child;
      }
    }
    const name = keys[depth];
    if (module.entities[name]) {
      return module.entities[name];
    }
    else {
      const child = new FlowEntity();
      child.name = name;
      child.parent = module;
      module.entities[name] = child;
      return child;
    }
  }

  *traverse (...keys: Array<string | string[]>): Generator<FlowEntity, void, void> {
    const visited = new Set();
    for (const key of keys) {
      const item = this.get(...([].concat(key)));
      if (item) {
        yield* item.walk(visited);
      }
    }
  }
}

export class FlowEntity {
  name: ? string;
  path: ? NodePath;
  parent: FlowModule;
  dependencies: FlowEntity[] = [];

  addDependency (entity: FlowEntity): FlowEntity {
    this.dependencies.push(entity);
    return this;
  }

  addDependent (entity: FlowEntity): FlowEntity {
    entity.dependencies.push(this);
    return this;
  }

  *walk (alreadyVisited: Set<FlowEntity>): Generator<FlowEntity, void, void> {
    if (alreadyVisited.has(this)) {
      return;
    }
    alreadyVisited.add(this);
    for (const dependency of this.dependencies) {
      if (!alreadyVisited.has(dependency)) {
        yield* dependency.walk(alreadyVisited);
      }
    }
    yield this;
  }
}