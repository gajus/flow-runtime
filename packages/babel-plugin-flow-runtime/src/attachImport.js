/* @flow */
import * as t from 'babel-types';

import type ConversionContext from './ConversionContext';
import type {NodePath} from 'babel-traverse';

export default function attachImport (context: ConversionContext, program: NodePath) {

  const importDeclaration = t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier(context.libraryId))],
    t.stringLiteral(context.libraryName)
  );
  for (const item of program.get('body')) {
    if (item.type === 'Directive') {
      continue;
    }
    item.insertBefore(importDeclaration);
    return;
  }
  program.insertAfter(importDeclaration);
}