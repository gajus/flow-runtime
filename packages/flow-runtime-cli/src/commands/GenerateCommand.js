/* @flow */
import generateDefinitions from '../generateDefinitions';
import type {Argv} from '../';

export const name = 'generate';

export const description = 'Generates a flow-runtime type declaration module for the types used in the given files or folders.';

export async function run (argv: Argv) {
  const [, ...searchPaths] = argv._;
  console.log(await generateDefinitions(searchPaths));
};
