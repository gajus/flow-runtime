/* @flow */

import {equal} from 'assert';

import fixtures from './fixtures';

import transform from '../transform';

import * as babylon from 'babylon';
import * as t from 'babel-types';
import template from 'babel-template';
import generate from 'babel-generator';
import {default as traverse, NodePath, Scope} from 'babel-traverse';


describe.only('transform', () => {
  for (const [name, {input, expected}] of fixtures) {
    it(`should transform ${name}`, () => {
      const parsed = parse(input);
      const transformed = transform(parsed);
      const generated = generate(transformed).code;
      equal(normalize(generated), normalize(expected));
    });
  }
});


function parse (source: string): NodePath {
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