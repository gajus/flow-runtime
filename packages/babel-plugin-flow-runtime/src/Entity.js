/* @flow */

import type {Node, NodePath, Scope} from '@babel/traverse';


export type EntityType
  = 'Value'
  | 'TypeAlias'
  | 'TypeParameter'
  | 'ClassTypeParameter'
  | 'ImportedType'
  ;

export default class Entity {
  path: ? NodePath;
  name: string;
  type: EntityType = 'Value';

  get node (): ? Node {
    return this.path && this.path.node;
  }

  get scope (): ? Scope {
    return this.path && this.path.scope;
  }

  get isTypeAlias (): boolean {
    return this.type === 'TypeAlias';
  }

  get isImportedType (): boolean {
    return this.type === 'ImportedType';
  }

  get isTypeParameter (): boolean {
    return this.type === 'TypeParameter';
  }

  get isClassTypeParameter (): boolean {
    return this.type === 'ClassTypeParameter';
  }

  get isValue (): boolean {
    return this.type === 'Value';
  }

  get isGlobal (): boolean {
    return this.path == null;
  }
}
