/* @flow */

import type {NodePath} from '@babel/traverse';

import type FlowModule from './FlowModule';

export default class FlowEntity {
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