/* @flow */
import * as t from '@babel/types';
import Deque from 'double-ended-queue';

type Node = {
  type: string;
  [key: number | string]: any;
};

type NodeVisitor = (node: Node, key: ? number | string, listKey: ? string, parent: ? Node) => any;


const VISITOR_KEYS = Object.assign({}, t.VISITOR_KEYS, {
  NumberLiteralTypeAnnotation: [],
  ExistsTypeAnnotation: [],
  DeclareExportDeclaration: ['declaration']
});

export default function fastTraverse (ast: Node, visitor: NodeVisitor) {
  traverseNode(ast, null, null, null, visitor);
}

function traverseNode (node: Node, key: ? number | string, listKey: ? string, parent: ? Node, visitor: NodeVisitor) {
  const result = visitor(node, key, listKey, parent);
  if (result === false) {
    return false;
  }
  const keys = VISITOR_KEYS[node.type];
  if (keys && keys.length > 0) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = node[key];
      if (Array.isArray(value)) {
        for (let j = 0; j < value.length; j++) {
          const item = value[j];
          if (item) {
            const result = traverseNode(item, j, key, node, visitor);
            if (result === false) {
              return false;
            }
          }
        }
      }
      else if (value) {
        const result = traverseNode(value, key, key, node, visitor);
        if (result === false) {
          return false;
        }
      }
    }
  }
}
