/* @flow */

import {equal} from 'assert';

import transform from '../transform';
import * as babel from '@babel/core';

import * as babylon from '@babel/parser';
import generate from '@babel/generator';
import traverse from '@babel/traverse';
import type {Node, NodePath} from '@babel/traverse';

import type {Options} from '../createConversionContext';

function stripFlowTypes (program: Node): Node {
  traverse(program, {
    Flow (path: NodePath) {
      path.remove();
    },
    TypeCastExpression(path) {
      let { node } = path;
      do {
        node = node.expression;
      } while (node.type === 'TypeCastExpression');
      path.replaceWith(node);
    },
    Class(path) {
      path.node.implements = null;
    }
  });
  return program;
}

function parse (source: string): Node {
  return babylon.parse(source, {
    filename: 'unknown',
    sourceType: 'module',
    plugins: [
      'jsx',
      'flow',
      'doExpressions',
      'objectRestSpread',
      'decorators-legacy',
      'classProperties',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'asyncGenerators',
      'functionBind',
      'functionSent'
    ]
  });
}

function normalize (input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\{\s+/g, '{\n')
    .replace(/\s+\}/g, '\n}')
    .replace(/\[\s+/g, '[')
    .replace(/\s+]/g, ']')
    .replace(/\}\s+([A-Za-z])/g, '\n}\n$1')
    .split(';')
    .join(';\n')
    .trim()
    ;
}

export default function testTransform(input: string, options: Options, expected: string, integration?: Object) {
  const parsed = parse(input);
  let generated;
  if (integration) {
    generated = babel.transform(input, integration).code;
  } else {
    const transformed = stripFlowTypes(transform(parsed, options));
    generated = generate(transformed).code;
  }
  equal(normalize(generated), normalize(expected));
}
