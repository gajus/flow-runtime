/* @flow */

import Declaration from './Declaration';

import type {Type} from '../types';
import type ModuleExportsDeclaration from './ModuleExportsDeclaration';

import type TypeContext from '../TypeContext';

import type Validation, {ErrorTuple, IdentifierPath} from '../Validation';

export type DeclarationDict = {
  [name: string]: Type<any>;
};

export type ModuleDeclarationDict = {
  [name: string]: ModuleDeclaration;
};

import {NameRegistrySymbol, ModuleRegistrySymbol} from '../symbols';

export default class ModuleDeclaration extends Declaration {
  typeName: string = 'ModuleDeclaration';


  name: string;
  innerContext: TypeContext;
  moduleExports: ? ModuleExportsDeclaration<any>;

  get moduleType (): 'commonjs' | 'es6' {
    if (this.moduleExports) {
      return 'commonjs';
    }
    else {
      return 'es6';
    }
  }

  get isCommonJS (): boolean {
    return this.moduleExports ? true : false;
  }

  get isES6 (): boolean {
    return this.moduleExports ? false : true;
  }

  get declarations (): DeclarationDict {
    const {innerContext} = this;
    return (innerContext: $FlowIssue<252>)[NameRegistrySymbol];
  }

  get modules (): ModuleDeclarationDict {
    const {innerContext} = this;
    return (innerContext: $FlowIssue<252>)[ModuleRegistrySymbol];
  }

  get (name: string): ? Type<any> {
    const {moduleExports} = this;
    if (moduleExports) {
      const exporting = moduleExports.unwrap();
      if (typeof exporting.getProperty === 'function') {
        const prop = exporting.getProperty(name);
        if (prop) {
          return prop.unwrap();
        }
      }
    }
    else {
      const declaration = this.declarations[name];
      if (declaration) {
        return declaration.unwrap();
      }
    }
  }

  *errors (validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void> {
    // Can't validate a module directly.
    // @todo should this throw?
  }

  import (moduleName: string): ? ModuleDeclaration {
    if (/^\.\//.test(moduleName)) {
      moduleName = `${this.name}${moduleName.slice(1)}`;
    }
    return this.innerContext.import(moduleName);
  }

  toString (): string {

    const {name, declarations, modules, moduleExports} = this;
    const body = [];
    for (const name in declarations) { // eslint-disable-line guard-for-in
      const declaration = declarations[name];
      body.push(declaration.toString(true));
    }
    if (modules) {
      for (const name in modules) { // eslint-disable-line guard-for-in
        const module = modules[name];
        body.push(module.toString());
      }
    }
    if (moduleExports) {
      body.push(moduleExports.toString());
    }
    return `declare module "${name}" {\n${indent(body.join('\n\n'))}}`;
  }
}


function indent (input: string): string {
  const lines = input.split('\n');
  const {length} = lines;
  for (let i = 0; i < length; i++) {
    lines[i] = `  ${lines[i]}`;
  }
  return lines.join('\n');
}