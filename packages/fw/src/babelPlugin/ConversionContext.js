/* @flow */


import * as t from 'babel-types';

import type {Node} from 'babel-traverse';


export default class ConversionContext {

  libraryName: string = 'runtime-types';
  libraryId: string = 't';

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