/* @flow */

import {parse} from 'flow-parser';
import path from 'path';
import * as t from 'babel-types';

import {fastTraverse} from './nodeIterator';

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
    program: t.program(parsed.body),
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
      node.declare = true;
    }
    else if (node.type === 'DeclareVariable') {
      console.log(node);
    }
  });
  return file;
}