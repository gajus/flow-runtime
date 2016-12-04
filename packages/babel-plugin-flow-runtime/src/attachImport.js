/* @flow */
import * as t from 'babel-types';

import type ConversionContext from './ConversionContext';
import type {NodePath} from 'babel-traverse';

export default function attachImport (context: ConversionContext, container: NodePath) {
  const importDeclaration = t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier(context.libraryId))],
    t.stringLiteral(context.libraryName)
  );
  for (const item of container.get('body')) {
    if (item.type === 'Directive') {
      continue;
    }
    item.insertBefore(importDeclaration);
    return;
  }
  container.insertAfter(importDeclaration);
}