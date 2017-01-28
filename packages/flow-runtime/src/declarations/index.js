/* @flow */

import Declaration from './Declaration';
import VarDeclaration from './VarDeclaration';
import TypeDeclaration from './TypeDeclaration';
import ModuleDeclaration from './ModuleDeclaration';
import ModuleExportsDeclaration from './ModuleExportsDeclaration';
import ClassDeclaration from './ClassDeclaration';
import ParameterizedClassDeclaration from './ParameterizedClassDeclaration';
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
  TypeDeclaration,
  VarDeclaration,
  ModuleDeclaration,
  ModuleExportsDeclaration,
  ClassDeclaration,
  ParameterizedClassDeclaration,
  ExtendsDeclaration
};