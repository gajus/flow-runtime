/* @flow */
import * as t from '@babel/types';

import type ConversionContext from './ConversionContext';
import type {NodePath} from '@babel/traverse';

export default function attachImport (context: ConversionContext, program: NodePath) {

  const importDeclaration = context.libraryImport === 'require'
    ? t.variableDeclaration('const', [
      t.variableDeclarator(
        t.identifier(context.libraryId),
        t.callExpression(t.identifier('require'), [t.stringLiteral(context.libraryName)])
      )
    ])
    : t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier(context.libraryId))],
      t.stringLiteral(context.libraryName)
    );

  if (t.isImportDeclaration(importDeclaration)) {
    importDeclaration.importKind = 'value';
  }

  context.shouldImport = false;

  let last;
  for (const item of program.get('body')) {
    if (item.isDirective() || item.isImportDeclaration()) {
      last = item;
      continue;
    }

    item.insertBefore(importDeclaration);
    return;
  }

  if (last) {
    last.insertAfter(importDeclaration);
  }
  else {
    program.get('body').unshiftContainer('body', importDeclaration);
  }
}
