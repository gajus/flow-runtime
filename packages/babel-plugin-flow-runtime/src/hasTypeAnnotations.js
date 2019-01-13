/* @flow */

import type {NodePath} from '@babel/traverse';


export default function hasTypeAnnotations (path: NodePath): boolean {
  if (path.has('typeAnnotation') || path.has('typeParameters')) {
    return true;
  }
  else if (path.isFunction()) {
    if (path.has('returnType')) {
      return true;
    }
    for (const param of path.get('params')) {
      if (hasTypeAnnotations(param)) {
        return true;
      }
    }
    return false;
  }
  else if (path.isClass()) {
    return path.has('superTypeParameters') || path.has('implements');
  }
  else if (path.isAssignmentPattern()) {
    return hasTypeAnnotations(path.get('left'));
  }
  else {
    return false;
  }
}
