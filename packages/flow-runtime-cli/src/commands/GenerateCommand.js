/* @flow */

import type {Argv} from '../';

import path from 'path';

import {transform} from 'babel-plugin-flow-runtime';

import findFiles from '../findFiles';
import parseFile from '../parseFile';
import collectExternalTypeReferences from '../collectExternalTypeReferences';


export const name = 'generate';

export const description = 'Generates a flow-runtime type declaration module for the types used in the given files or folders.';

export async function run (argv: Argv) {
  const [, ...input] = argv._;
  const filenames = await findFiles(...input);
  const files = await Promise.all(filenames.map(parseFile));

  const globalTypeNames = {};
  const importedModules = {};

  for (const file of files) {
    const {importedTypes, globalTypes} = collectExternalTypeReferences(file);

    for (const key in importedTypes) {
      let {source} = importedTypes[key];
      if (/^\.\.?[\/|\\]/.test(source)) {
        source = path.resolve(path.dirname(file.filename), source);
      }

      if (importedModules[source]) {
        importedModules[source]++;
      }
      else {
        importedModules[source] = 1;
      }
    }

    for (const key in globalTypes) {
      const value = globalTypes[key];
      if (globalTypeNames[key]) {
        globalTypeNames[key] += value;
      }
      else {
        globalTypeNames[key] = value;
      }
    }
  }

  console.log('globals:', globalTypeNames);
  console.log('modules:', importedModules);

};

