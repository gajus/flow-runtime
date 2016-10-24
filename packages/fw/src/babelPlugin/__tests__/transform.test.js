/* @flow */

import {equal} from 'assert';

import fixtures from './fixtures';

import transform from '../transform';

import * as babylon from 'babylon';
import generate from 'babel-generator';
import traverse from 'babel-traverse';
import type {Node, NodePath} from 'babel-traverse';


describe.only('transform', () => {
  for (const [name, {input, expected}] of fixtures) {
    it(`should transform ${name}`, () => {
      const parsed = parse(input);
      const transformed = stripFlowTypes(transform(parsed));
      const generated = generate(transformed).code;
      equal(normalize(generated), normalize(expected));
    });
  }
});


function stripFlowTypes (program: Node): Node {
  traverse(program, {
    Flow (path: NodePath) {
      path.remove();
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
      'decorators',
      'classProperties',
      'exportExtensions',
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
    .replace(/\s+\]/g, ']')
    .split(';')
    .join(';\n')
    ;
}