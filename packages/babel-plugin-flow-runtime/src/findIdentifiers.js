/* @flow */
import type {NodePath} from '@babel/traverse';

export default function findIdentifiers (path: NodePath | NodePath[], found: NodePath[] = []): NodePath[] {
  if (Array.isArray(path)) {
    for (const item of path) {
      findIdentifiers(item, found);
    }
    return found;
  }
  if (path.isIdentifier()) {
    found.push(path);
  }
  else if (path.isAssignmentPattern()) {
    findIdentifiers(path.get('left'), found);
  }
  else if (path.isArrayPattern()) {
    for (const element of path.get('elements')) {
      findIdentifiers(element, found);
    }
  }
  else if (path.isObjectPattern()) {
    for (const property of path.get('properties')) {
      findIdentifiers(property.get('value'), found);
    }
  }
  else if (path.isRestElement() || path.isRestProperty()) {
    findIdentifiers(path.get('argument'), found);
  }
  return found;
}
