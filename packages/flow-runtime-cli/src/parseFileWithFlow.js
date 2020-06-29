/* @flow */

import {parse} from 'flow-parser';
import path from 'path';
import * as t from '@babel/types';

import fastTraverse from './fastTraverse';

type FileNode = {
  type: string;
  filename: string;
};

import {fs} from './util';

export default async function parseFileWithFlow (filename: string): Promise<FileNode> {
  const input = await fs.readFileAsync(filename, 'utf8');
  const parsed = parse(input, {
    esproposal_decorators: true,
    esproposal_class_instance_fields: true,
    esproposal_class_static_fields: true,
    esproposal_export_star_as: true
  });
  return flowToBabylon({
    type: 'File',
    program: parsed,
    filename: path.resolve(filename)
  });
}


function flowToBabylon (file: FileNode): FileNode {
  fastTraverse(file, (node, key, listKey, parent) => {
    if (node.type === 'ExistsTypeAnnotation') {
      node.type = 'ExistentialTypeParam';
    }
    else if (node.type === 'NumberLiteralTypeAnnotation') {
      node.type = 'NumericLiteralTypeAnnotation';
    }
    else if (node.type === 'DeclareExportDeclaration') {
      node.type = 'ExportNamedDeclaration';
      if (node.default) {
        const id = t.identifier('default');
        id.typeAnnotation = t.typeAnnotation(node.declaration);
        node.declaration = t.declareVariable(id);
      }
      node.declare = true;
    }
    else if (key != null && node.type === 'Identifier' && node.name === '@@iterator' && parent) {
      const replacement = t.memberExpression(
        t.identifier('Symbol'),
        t.identifier('iterator')
      );
      if (key === listKey) {
        parent[key] = replacement;
        parent.computed = true;
      }
      else if (listKey != null) {
        parent[listKey][key] = replacement;
      }
    }
  });
  return file;
}