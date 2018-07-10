/* @flow */
import * as t from '@babel/types';

import type ConversionContext from './ConversionContext';
import convert from './convert';

import type {NodePath} from '@babel/traverse';

import hasTypeAnnotations from './hasTypeAnnotations';


export default function annotateVisitors (context: ConversionContext): Object {
  return {
    Function: {
      exit (path: NodePath) {
        if (context.shouldSuppressPath(path) || context.visited.has(path.node) || path.isClassMethod() || path.isObjectMethod()) {
          path.skip();
          return;
        }
        context.visited.add(path.node);
        if (!hasTypeAnnotations(path)) {
          return;
        }

        const extractedName = path.isArrowFunctionExpression() && extractFunctionName(path);
        if (extractedName) {
          path.arrowFunctionToShadowed();
          path.node.id = t.identifier(extractedName);
        }

        const typeCall = convert(context, path);

        // Capture the data from the scope, as it
        // may be overwritten by the replacement.
        const scopeData = path.get('body').scope.data;

        if (path.isExpression()) {
          const replacement = context.call(
            'annotate',
            path.node,
            typeCall
          );
          context.replacePath(path, replacement);
          // Refetch the replaced node
          const body = path.get('body');
          body.scope.data = Object.assign(scopeData, body.scope.data);
        }
        else if (path.has('id')) {
          const replacement = t.expressionStatement(
            context.call(
              'annotate',
              path.node.id,
              typeCall
            )
          );
          if (path.parentPath.isExportDefaultDeclaration() || path.parentPath.isExportDeclaration()) {
            path.parentPath.insertAfter(replacement);
          }
          else {
            path.insertAfter(replacement);
          }
        }
        else if (path.isFunctionDeclaration() && path.parentPath.isExportDefaultDeclaration()) {
          // @fixme - this is not nice, we just turn the declaration into an expression.
          path.node.type = 'FunctionExpression';
          // TODO(vjpr): BABEL7: https://babeljs.io/docs/en/next/v7-migration-api#expression-field-removed-from-arrowfunctionexpression
          path.node.expression = true;
          const replacement = t.exportDefaultDeclaration(
            context.call(
              'annotate',
              path.node,
              typeCall
            )
          );
          context.replacePath(path.parentPath, replacement);

          // Refetch the replaced node
          const body = path.get('body');
          body.scope.data = Object.assign(scopeData, body.scope.data);
        }
        else {
          console.warn('Could not annotate function with parent node:', path.parentPath.type);
        }
      }
    },


    Class: {
      exit (path: NodePath) {
        if (context.shouldSuppressPath(path)) {
          path.skip();
          return;
        }
        const typeCall = convert(context, path);
        const decorator = t.decorator(
          context.call('annotate', typeCall)
        );
        if (!path.has('decorators')) {
          path.node.decorators = [];
        }
        path.unshiftContainer('decorators', decorator);
      }
    }
  };
}


function extractFunctionName (path: NodePath): ? string {
  let id;
  if (path.parentPath.type === 'VariableDeclarator') {
    id = path.parentPath.node.id;
  }
  else if (path.parentPath.type === 'AssignmentExpression') {
    id = path.parentPath.node.left;
  }
  else {
    return;
  }

  if (id.type === 'Identifier') {
    return id.name;
  }
  else if (id.type === 'MemberExpression' && !id.computed) {
    return id.property.name;
  }
}
