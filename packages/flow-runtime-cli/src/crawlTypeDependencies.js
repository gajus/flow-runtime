/* @flow */

import findFiles from './findFiles';
import parseFile from './parseFile';
import collectExternalTypeReferences from './collectExternalTypeReferences';

export type DependencyDict = {
  [name: string]: number;
};

export type ModuleDependencyDict = {
  [name: string]: DependencyDict;
};

export type CrawledDependencies = {
  globalDependencies: DependencyDict;
  moduleDependencies: ModuleDependencyDict;
};

export default async function crawlTypeDependencies (searchPaths: string[]): Promise<CrawledDependencies> {
  const filenames = await findFiles(...searchPaths);
  const files = await Promise.all(filenames.map(parseFile));

  const globalDependencies = {};
  const moduleDependencies = {};

  for (const file of files) {
    const {importedTypes, globalTypes} = collectExternalTypeReferences(file);

    for (const key in importedTypes) {
      const {source} = importedTypes[key];
      if (/^\.\.?[\/|\\]/.test(source)) {
        continue;
      }
      let moduleExports = moduleDependencies[source];
      if (!moduleExports) {
        moduleExports = {};
        moduleDependencies[source] = moduleExports;
      }
      if (moduleExports[key]) {
        moduleExports[key]++;
      }
      else {
        moduleExports[key] = 1;
      }
    }

    for (const key in globalTypes) {
      const value = globalTypes[key];
      if (globalDependencies[key]) {
        globalDependencies[key] += value;
      }
      else {
        globalDependencies[key] = value;
      }
    }
  }
  return {globalDependencies, moduleDependencies};
}
