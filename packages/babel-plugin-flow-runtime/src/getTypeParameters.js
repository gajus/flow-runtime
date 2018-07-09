/* @flow */

import type {NodePath} from '@babel/traverse';

/**
 * Get an array of type parameters from the given path.
 */
export default function getTypeParameters (path: NodePath): NodePath[] {
  const node = path.node;
  if (node && node.typeParameters && node.typeParameters.params) {
    return path.get('typeParameters.params');
  }
  else {
    return [];
  }
}
