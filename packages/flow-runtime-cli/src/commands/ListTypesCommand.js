/* @flow */
import crawlTypeDependencies from '../crawlTypeDependencies';
import type {Argv} from '../';

export const name = 'list-types';

export const description = 'Lists all the types referenced in source files.';

export async function run (argv: Argv) {
 const [, ...searchPaths] = argv._;
 const {globalDependencies, moduleDependencies} = await crawlTypeDependencies(searchPaths);
 console.log('Global dependencies:');
 console.log(dumpDependencies(globalDependencies));
 for (const moduleName in moduleDependencies) {
  console.log(`Types imported from ${moduleName}:`);
  console.log(dumpDependencies(moduleDependencies[moduleName]));
 }
};

function dumpDependencies (obj: Object, indent: number = 0): string {
  return `  ${Object.keys(obj).join('\n  ')}\n`;
}
