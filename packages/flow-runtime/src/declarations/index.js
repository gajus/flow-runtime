/* @flow */

import Declaration from './Declaration';
import ClassDeclaration from './ClassDeclaration';
import ExtendsDeclaration from './ExtendsDeclaration';

import type {
  Type,
  TypeParameter,
  ObjectType,
  ObjectTypeProperty,
  PartialType,
  ObjectPropertyDict
} from '../types';


export type ClassBodyCreator <X, O> = (
  partial: PartialType<Class<O>>
) => Array<ValidClassBody<X, O>>;

export type ValidClassBody<X, O: Object>
  = TypeParameter<X>
  | ObjectType<O>
  | ObjectTypeProperty<$Keys<O>, $ObjMap<O, <K>(k: Type<K>) => X | K>>
  | ObjectPropertyDict<O>
  | ExtendsDeclaration<Object>
  ;


export {
  Declaration,
  ClassDeclaration,
  ExtendsDeclaration
};