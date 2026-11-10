/* @flow */

import path from 'path';
import fs from 'fs';
import {createRequire} from 'module';

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
  packageDefinitions: {[name: string]: string};
};

export default async function crawlTypeDependencies (searchPaths: string[]): Promise<CrawledDependencies> {
  const filenames = await findFiles(...searchPaths);
  const files = await Promise.all(filenames.map(parseFile));

  const globalDependencies = {};
  const moduleDependencies = {};
  const packageDefinitions = Object.create(null);

  for (const file of files) {
    const {importedTypes, globalTypes} = collectExternalTypeReferences(file);

    for (const key in importedTypes) {
      const {source, imported, isDefault, isNamespace} = importedTypes[key];
      if (/^\.\.?[\/|\\]/.test(source)) {
        continue;
      }
      if (!isDefault && !isNamespace && !path.isAbsolute(source)) {
        let shadow;
        try {
          shadow = `${createRequire(file.filename).resolve(source)}.flow`;
        }
        catch (error) {
          if (error.code !== 'MODULE_NOT_FOUND' && error.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') throw error;
        }
        if (shadow && fs.existsSync(shadow)) {
          if (packageDefinitions[source] && packageDefinitions[source] !== shadow) {
            throw new Error(`Multiple Flow definitions resolve for ${source}`);
          }
          packageDefinitions[source] = shadow;
        }
      }
      let moduleExports = moduleDependencies[source];
      if (!moduleExports) {
        moduleExports = {};
        moduleDependencies[source] = moduleExports;
      }
      if (moduleExports[imported]) {
        moduleExports[imported]++;
      }
      else {
        moduleExports[imported] = 1;
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
  return {globalDependencies, moduleDependencies, packageDefinitions};
}
