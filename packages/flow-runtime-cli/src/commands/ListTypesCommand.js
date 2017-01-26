/* @flow */

import type {Argv} from '../';
import generate from 'babel-generator';
import * as t from 'babel-types';
import path from 'path';

import {transform} from 'babel-plugin-flow-runtime';

import findFiles from '../findFiles';
import parseFileWithFlow from '../parseFileWithFlow';
import collectExternalTypeReferences from '../collectExternalTypeReferences';
import collectTypeDeclarations from '../collectTypeDeclarations';

import Graph from '../Graph';
import importAST from '../importAST';

export const name = 'list-types';

export const description = 'Lists all the types found in definition files.';

export async function run (argv: Argv) {
  const [, ...input] = argv._;
  const filenames = await findFiles(...input);
  const files = await Promise.all(filenames.map(parseFileWithFlow));

  const graph = new Graph();

  const declarations = files.map(file => [file.filename, importAST(graph, file)]);
  const block = [];
  for (const vertex of graph.traverse(['bluebird', 'exports'], ['aphrodite', 'css'])) {
  //for (const vertex of graph.traverse(['bluebird', 'exports'])) {
    if (vertex.path) {
      block.unshift(vertex.path.node);
    }
    //console.log(vertex.name, vertex.path && vertex.path.type, vertex.out);
  }
  const prog = t.file(t.program(block));
  transform(prog);
  const {code} = generate(prog);
  console.log(code);

  //console.log(graph.collection.collections.minimist.definitions);
};

