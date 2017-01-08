/* @flow */
import * as t from 'babel-types';

import type ConversionContext from './ConversionContext';
import convert from './convert';

import type {Node, NodePath} from 'babel-traverse';

type SimplifiedParam = {
  name: string;
  isRest: boolean;
  isPattern: boolean;
  default: ? NodePath;
  typeAnnotation: ? NodePath;
};

export default function patternMatchVisitors (context: ConversionContext): Object {
  const isPatternCall = t.buildMatchMemberExpression(`${context.libraryId}.pattern`);
  return {
    CallExpression (path: NodePath) {
      const callee = path.get('callee');
      const args = path.get('arguments');
      if (!isPatternCall(callee.node)) {
        return;
      }
      // Ensure that every argument is a function, and build a collection of params.
      const collectedParams = [];
      const collectedBlocks = [];
      for (const arg of args) {
        if (!arg.isFunction()) {
          return;
        }
        const simplified = getSimplifiedParams(arg);
        if (!simplified) {
          // found unsupported parameter type or no args, bail out.
          return;
        }
        collectedParams.push(simplified);
        //arg.ensureBlock();
        const body = arg.get('body');
        collectedBlocks.push(body);
      }

      context.replacePath(path, makePattern(context, collectedParams, collectedBlocks));
    }
  };
};

function makePattern (context: ConversionContext, collectedParams: SimplifiedParam[][], collectedBlocks: NodePath[]): Node {
  const names = [];
  const isRest = collectRestIndexes(collectedParams);
  const paramsLength = isRest.length;
  const isPattern = collectPatternIndexes(collectedParams);
  let firstRest = 0; // tracks the index of the first rest element we've seen
  for (; firstRest < isRest.length; firstRest++) {
    if (isRest[firstRest]) {
      break;
    }
  }

  const hasRest = firstRest < paramsLength;
  const tests = new Array(collectedBlocks.length);

  for (let index = 0; index < collectedParams.length; index++) {
    const params = collectedParams[index];
    const block = collectedBlocks[index];
    const test = [];
    tests[index] = test;
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      let name = param.name;
      if (i >= names.length) {
        name = `_arg${i}`;
        names.push(name);
      }
      else {
        name = names[i];
      }

      let replacement;
      let useBinding = false;

      if (i === firstRest) {
        if (param.isRest) {
          replacement = t.identifier(name);
        }
        else {
          // take the first element of the param.
          replacement = t.memberExpression(
            t.identifier(name),
            t.numericLiteral(0),
            true
          );
          useBinding = true;
        }
      }
      else if (i > firstRest) {
        const relativeIndex = i - firstRest;
        if (param.isRest) {
          // take a slice of the rest element.
          replacement = t.callExpression(
            t.memberExpression(
              t.identifier(names[firstRest]),
              t.identifier('slice')
            ),
            [t.numericLiteral(relativeIndex)]
          );
          useBinding = true;
        }
        else {
          // take the nth member of the rest element.
          replacement = t.memberExpression(
            t.identifier(names[firstRest]),
            t.numericLiteral(relativeIndex),
            true
          );
          useBinding = true;
        }
      }
      else {
        replacement = t.identifier(name);
      }

      if (param.typeAnnotation) {
        test.push(
          inlineTest(context, param.typeAnnotation, replacement),
        );
      }
      if (useBinding) {
        const binding = block.scope.getBinding(param.name);
        for (const refPath of binding.referencePaths) {
          if (refPath.isIdentifier()) {
            refPath.replaceWith(replacement);
          }
          else {
            // we've already replaced this, go looking for the reference.
            refPath.traverse({
              Identifier (id: NodePath) {
                if (id.node.name === param.name) {
                  id.replaceWith(replacement);
                }
              }
            });
          }
        }
      }
      else {
        block.scope.rename(param.name, name);
      }
    }
  }
  const normalizedParams = [];
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (isRest[i]) {
      normalizedParams.push(t.restElement(t.identifier(name)));
      break;
    }
    else {
      normalizedParams.push(t.identifier(name));
    }
  }
  return t.arrowFunctionExpression(
    normalizedParams,
    t.blockStatement([tests.reduceRight((last, test, index) => {
      const block = collectedBlocks[index];
      const condition = test.reduce((prev, condition) => {
        if (prev === null) {
          return condition;
        }
        else {
          return t.logicalExpression(
            '&&',
            prev,
            condition
          );
        }
      }, null);
      if (last === null) {
        if (condition === null) {
          return ensureBlockStatement(block.node);
        }
        else {
          return t.ifStatement(condition, ensureBlockStatement(block.node));
        }
      }
      else {
        return t.ifStatement(
          condition,
          ensureBlockStatement(block.node),
          last
        );
      }
    }, null)])
  );
}

function collectRestIndexes (collectedParams: SimplifiedParam[][]): boolean[] {
  const indexes = [];
  for (let index = 0; index < collectedParams.length; index++) {
    const params = collectedParams[index];
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      if (i >= indexes.length) {
        indexes.push(param.isRest);
      }
      else if (param.isRest) {
        indexes[i] = true;
      }
    }
  }
  return indexes;
}

function collectPatternIndexes (collectedParams: SimplifiedParam[][]): boolean[] {
  const indexes = [];
  for (let index = 0; index < collectedParams.length; index++) {
    const params = collectedParams[index];
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      if (i >= indexes.length) {
        indexes.push(param.isPattern);
      }
      else if (param.isPattern) {
        indexes[i] = true;
      }
    }
  }
  return indexes;
}

function inlineTest (context: ConversionContext, typeAnnotation: NodePath, replacement: Node): Node {
  if (typeAnnotation.isTypeAnnotation()) {
    typeAnnotation = typeAnnotation.get('typeAnnotation');
  }
  if (typeAnnotation.isStringTypeAnnotation()) {
    return inlineTypeOf('string', typeAnnotation, replacement);
  }
  else if (typeAnnotation.isNumberTypeAnnotation()) {
    return inlineTypeOf('number', typeAnnotation, replacement);
  }
  else if (typeAnnotation.isBooleanTypeAnnotation()) {
    return inlineTypeOf('boolean', typeAnnotation, replacement);
  }
  else if (typeAnnotation.isVoidTypeAnnotation()) {
    return inlineTypeOf('undefined', typeAnnotation, replacement);
  }
  else if (typeAnnotation.isStringLiteralTypeAnnotation()) {
    return t.binaryExpression(
      '===',
      replacement,
      t.stringLiteral(typeAnnotation.node.value)
    );
  }
  else if (typeAnnotation.isNumericLiteralTypeAnnotation()) {
    return t.binaryExpression(
      '===',
      replacement,
      t.numberLiteral(typeAnnotation.node.value)
    );
  }
  else if (typeAnnotation.isBooleanLiteralTypeAnnotation()) {
    return t.binaryExpression(
      '===',
      replacement,
      t.booleanLiteral(typeAnnotation.node.value)
    );
  }
  else if (typeAnnotation.isNullLiteralTypeAnnotation()) {
    return t.binaryExpression(
      '===',
      replacement,
      t.nullLiteral(typeAnnotation.node.value)
    );
  }
  else if (typeAnnotation.isUnionTypeAnnotation()) {
    return typeAnnotation.get('types').reduce((last, item) => {
      if (last === null) {
        return inlineTest(context, item, replacement);
      }
      else {
        return t.logicalExpression(
          '||',
          last,
          inlineTest(context, item, replacement)
        );
      }
    }, null);
  }
  else if (typeAnnotation.isIntersectionTypeAnnotation()) {
    return typeAnnotation.get('types').reduce((last, item) => {
      if (last === null) {
        return inlineTest(context, item, replacement);
      }
      else {
        return t.logicalExpression(
          '&&',
          last,
          inlineTest(context, item, replacement)
        );
      }
    }, null);
  }
  else if (typeAnnotation.isNullableTypeAnnotation()) {
    return t.logicalExpression(
      '||',
      t.binaryExpression(
        '==',
        replacement,
        t.nullLiteral()
      ),
      inlineTest(context, typeAnnotation.get('typeAnnotation'), replacement)
    );
  }

  return t.callExpression(
    t.memberExpression(
      convert(context, typeAnnotation),
      t.identifier('accepts')
    ),
    [replacement]
  );
}

function inlineTypeOf (typeOf: string, typeAnnotation: NodePath, replacement: Node) {
  return t.binaryExpression(
    '===',
    t.unaryExpression(
      'typeof',
      replacement
    ),
    t.stringLiteral(typeOf)
  );
}

function ensureBlockStatement (node: Node) {
  if (t.isBlockStatement(node)) {
    return node;
  }
  else {
    return t.blockStatement([
      t.returnStatement(
        node
      )
    ]);
  }
}

function getSimplifiedParams (path: NodePath): false | SimplifiedParam[] {
  const simplified = [];
  for (const param of path.get('params')) {
    if (param.isIdentifier()) {
      simplified.push({
        name: param.node.name,
        isRest: false,
        isPattern: false,
        default: null,
        typeAnnotation: param.has('typeAnnotation') ? param.get('typeAnnotation') : null
      });
    }
    else if (param.isAssignmentPattern()) {
      const left = param.get('left');
      if (left.isIdentifier()) {
        simplified.push({
          name: left.node.name,
          isRest: false,
          isPattern: false,
          default: path.get('right'),
          typeAnnotation: left.has('typeAnnotation') ? left.get('typeAnnotation') : null
        });
      }
      else if (left.isArrayPattern() || left.isObjectPattern()) {
        simplified.push({
          name: `_arg${param.key}`,
          isRest: false,
          isPattern: true,
          default: path.get('right'),
          typeAnnotation: left.has('typeAnnotation') ? left.get('typeAnnotation') : null
        });
      }
      else {
        // should never happen.
        return false;
      }
    }
    else if (param.isRestElement()) {
      const id = param.get('argument');
      if (!id.isIdentifier()) {
        // should never happen
        return false;
      }
      simplified.push({
        name: id.node.name,
        isRest: true,
        isPattern: false,
        default: null,
        typeAnnotation: param.has('typeAnnotation') ? param.get('typeAnnotation') : null
      });
    }
    else if (param.isArrayPattern() || param.isObjectPattern()) {
      simplified.push({
        name: `_arg${param.key}`,
        isRest: false,
        isPattern: false,
        default: path.get('right'),
        typeAnnotation: param.has('typeAnnotation') ? param.get('typeAnnotation') : null
      });
    }
  }
  return simplified.length === 0 ? false : simplified;
}