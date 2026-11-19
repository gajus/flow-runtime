/* @flow */
import * as t from '@babel/types';

export default function hasReadOnlyArrayAnnotation (node: any, scope: any, seen: Set<any> = new Set()): boolean {
  if (!node || seen.has(node)) return false;
  seen.add(node);
  if (node.type === 'GenericTypeAnnotation' && node.id.type === 'Identifier') {
    const name = node.id.name;
    const alias = scope.getData(`readOnlyAlias:${name}`);
    if (alias) return hasReadOnlyArrayAnnotation(alias.node, alias.scope, seen);
    if (name === '$ReadOnlyArray') return true;
  }
  for (const key of t.VISITOR_KEYS[node.type] || []) {
    const value = node[key];
    if (Array.isArray(value)) {
      if (value.some(item => hasReadOnlyArrayAnnotation(item, scope, seen))) return true;
    }
    else if (hasReadOnlyArrayAnnotation(value, scope, seen)) return true;
  }
  return false;
}
