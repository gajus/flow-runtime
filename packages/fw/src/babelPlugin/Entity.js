/* @flow */

import type {Node, NodePath} from 'babel-traverse';


export type EntityType
  = 'Value'
  | 'TypeAlias'
  | 'TypeParameter'
  | 'ClassTypeParameter'
  ;

export default class Entity {
  path: ? NodePath;
  name: string;
  type: EntityType = 'Value';

  get node (): ? Node {
    return this.path && this.path.node;
  }

  get isTypeAlias (): boolean {
    return this.type === 'TypeAlias';
  }

  get isTypeParameter (): boolean {
    return this.type === 'TypeParameter';
  }

  get isClassTypeParameter (): boolean {
    return this.type === 'ClassTypeParameter';
  }

  get isValue (): boolean {
    return this.type === 'ClassTypeParameter';
  }

  get isGlobal (): boolean {
    return this.path == null;
  }
}