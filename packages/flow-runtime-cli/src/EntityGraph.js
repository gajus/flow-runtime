/* @flow */

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

export class FlowModule {
  name: ? string;
  parent: ? FlowModule;
  entities: FlowEntityDict = {};
  modules: FlowModuleDict = {};

  nodeEntities: WeakMap<Node, FlowEntity> = new WeakMap();

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

  getEntityForPath (path: NodePath): FlowEntity {
    const {nodeEntities} = this;
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
}