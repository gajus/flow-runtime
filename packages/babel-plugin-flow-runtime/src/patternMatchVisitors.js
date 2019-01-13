/* @flow */
import * as t from '@babel/types';

import generate from '@babel/generator';

import type ConversionContext from './ConversionContext';
import convert from './convert';

import type {Node, NodePath} from '@babel/traverse';

type SimplifiedParam = {
  path: NodePath;
  name: string;
  isRest: boolean;
  isPattern: boolean;
  default: ? NodePath;
  typeAnnotation: ? NodePath;
};

export default function patternMatchVisitors (context: ConversionContext): Object {
  const isPatternCall = t.buildMatchMemberExpression(`${context.libraryId}.pattern`);
  const isMatchCall = t.buildMatchMemberExpression(`${context.libraryId}.match`);
  return {
    CallExpression (path: NodePath) {
      const callee = path.get('callee');
      if (isPatternCall(callee.node)) {
        transformPatternCall(context, path);
      }
      else if (isMatchCall(callee.node)) {
        transformMatchCall(context, path);
      }
    }
  };
};

/**
 * Transform a call to `t.match()` into an optimized version if possible.
 */
function transformMatchCall (context: ConversionContext, path: NodePath) {
  // the first arguments are the input, the last should be an array of clauses
  const args = path.get('arguments');
  if (args.length < 2) {
    // must have at least two arguments, bail out
    return;
  }
  const tail = args.pop();
  if (!tail.isArrayExpression()) {
    // last arg must be an array of clauses, bail out
    return;
  }

  const clauses = tail.get('elements');

  if (!clauses.length) {
    // empty array of clauses, bail out.
    return;
  }

  const collected = collectClauses(context, clauses);
  if (!collected) {
    return;
  }
  const [collectedParams, collectedBlocks, errorClause] = collected;
  const pattern = makePattern(context, path, collectedParams, collectedBlocks, errorClause);
  if (pattern) {
    context.replacePath(path, t.callExpression(pattern, args.map(arg => arg.node)));
  }
}

/**
 * Transform a call to `t.pattern()` into an inline function (if possible)
 */
function transformPatternCall (context: ConversionContext, path: NodePath) {
  const args = path.get('arguments');

  const collected = collectClauses(context, args);
  if (!collected) {
    return;
  }
  const [collectedParams, collectedBlocks, errorClause] = collected;

  const pattern = makePattern(context, path, collectedParams, collectedBlocks, errorClause);
  if (pattern) {
    context.replacePath(path, pattern);
  }
}

function collectClauses (context: ConversionContext, args: NodePath) {
  // Ensure that every argument is a function, and build a collection of params.
  const collectedParams = [];
  const collectedBlocks = [];
  let hasDefaultClause = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg.isFunction()) {
      // argument is some other kind of expression, bail out to runtime.
      return;
    }
    if (arg.has('typeParameters')) {
      // too complicated to inline, bail out.
      return;
    }
    const simplified = getSimplifiedParams(arg);
    if (!simplified) {
      // found unsupported parameter type or no args, bail out.
      return;
    }
    const isAnnotated = simplified.some(item => item.typeAnnotation);
    if (!isAnnotated) {
      if (i !== args.length - 1) {
        // unannotated function not in the last position.
        // this is almost certainly an error but let runtime deal with it.
        return;
      }
      else {
        hasDefaultClause = true;
      }
    }
    collectedParams.push(simplified);
    const body = arg.get('body');
    collectedBlocks.push(body);
  }
  const errorClause = hasDefaultClause ? null : makeNoMatchErrorBlock(context, collectedParams);

  return [collectedParams, collectedBlocks, errorClause];
}

function stringifyType (input: ? Node | NodePath): string {
  if (!input) {
    return 'any';
  }
  else if (input.node) {
    input = input.node;
  }
  if (t.isTypeAnnotation(input)) {
    input = input.typeAnnotation;
  }
  const {code} = generate(input);
  return code;
}

function makeNoMatchErrorBlock (context: ConversionContext, collectedParams: SimplifiedParam[][]): Node {
  const expected = collectedParams.map(params => {
    const strings = params.map(param => stringifyType(param.typeAnnotation));
    if (strings.length > 1) {
      return `(${strings.join(', ')})`;
    }
    else {
      return strings[0] || 'empty';
    }
  });
  const message = `Value did not match any of the candidates, expected:\n\n    ${expected.join('\nor:\n    ')}\n`;

  const body = [
    t.variableDeclaration('const', [
      t.variableDeclarator(
        t.identifier('error'),
        t.newExpression(
          t.identifier('TypeError'),
          [t.stringLiteral(message)]
        )
      )
    ]),
    t.expressionStatement(t.assignmentExpression(
      '=',
      t.memberExpression(t.identifier('error'), t.identifier('name')),
      t.stringLiteral('RuntimeTypeError')
    )),
    t.throwStatement(t.identifier('error'))
  ];

  return t.blockStatement(body);
}



function makePattern (context: ConversionContext, path: NodePath, collectedParams: SimplifiedParam[][], collectedBlocks: NodePath[], errorClause: ? Node = null): Node {
  const names = [];
  const sliceNames = {};
  const fnPrelude = [];
  const isRest = collectRestIndexes(collectedParams);
  let firstRest = 0; // tracks the index of the first rest element we've seen
  for (; firstRest < isRest.length; firstRest++) {
    if (isRest[firstRest]) {
      break;
    }
  }

  const tests = new Array(collectedBlocks.length);
  const blockPreludes = new Array(collectedBlocks.length);

  for (let index = 0; index < collectedParams.length; index++) {
    const params = collectedParams[index];
    const block = collectedBlocks[index];
    const blockPrelude = [];
    blockPreludes[index] = blockPrelude;
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
            t.NumericLiteral(0),
            true
          );
          useBinding = true;
        }
      }
      else if (i > firstRest) {
        // this param appears somewhere after the first rest param
        const relativeIndex = i - firstRest;
        if (param.isRest) {
          // this is rest too so we need to slice the existing rest param
          // we only want to do this once though so we keep a cache
          if (sliceNames[i]) {
            // we've already sliced this.
            replacement = t.identifier(sliceNames[i]);
            name = sliceNames[i];
          }
          else {
            // take a slice of the rest element and store it in a new var.

            const uid = path.scope.generateUid(param.name);
            sliceNames[i] = uid;
            name = uid;

            replacement = t.identifier(uid);

            fnPrelude.push(t.variableDeclaration('const', [
              t.variableDeclarator(
                t.identifier(uid),
                t.callExpression(
                  t.memberExpression(
                    t.identifier(names[firstRest]),
                    t.identifier('slice')
                  ),
                  [t.NumericLiteral(relativeIndex)]
                )
              )
            ]));
          }
        }
        else {
          // take the nth member of the rest element.
          replacement = t.memberExpression(
            t.identifier(names[firstRest]),
            t.NumericLiteral(relativeIndex),
            true
          );
          useBinding = true;
        }
      }
      else {
        // this is just a normal param
        replacement = t.identifier(name);
      }

      if (param.typeAnnotation) {
        test.push(
          inlineTest(context, param.typeAnnotation, replacement),
        );
      }

      if (param.isPattern) {
        blockPrelude.push(t.variableDeclaration('let', [
          t.variableDeclarator(
            param.path.node,
            replacement
          )
        ]));
      }
      else if (useBinding) {
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
    t.blockStatement(fnPrelude.concat(tests.reduceRight((last, test, index) => {
      const block = collectedBlocks[index];
      const blockPrelude = blockPreludes[index];
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
          return prependBlockStatement(block.node, blockPrelude);
        }
        else {
          return t.ifStatement(condition, prependBlockStatement(block.node, blockPrelude));
        }
      }
      else {
        return t.ifStatement(
          condition,
          prependBlockStatement(block.node, blockPrelude),
          last
        );
      }
    }, errorClause)))
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
  else if (typeAnnotation.isNumberLiteralTypeAnnotation()) {
    return t.binaryExpression(
      '===',
      replacement,
      t.NumericLiteral(typeAnnotation.node.value)
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
      t.nullLiteral()
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

function prependBlockStatement (node: Node, prelude: Node[]) {
  const body = t.isBlockStatement(node) ? node.body : [t.returnStatement(node)];
  return t.blockStatement([
    ...prelude,
    ...body
  ]);
}

function getSimplifiedParams (path: NodePath): false | SimplifiedParam[] {
  const simplified = [];
  for (const param of path.get('params')) {
    if (param.isIdentifier()) {
      simplified.push({
        path: param,
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
          path: left,
          name: left.node.name,
          isRest: false,
          isPattern: false,
          default: path.get('right'),
          typeAnnotation: left.has('typeAnnotation') ? left.get('typeAnnotation') : null
        });
      }
      else if (left.isArrayPattern() || left.isObjectPattern()) {
        simplified.push({
          path: left,
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
        path: id,
        name: id.node.name,
        isRest: true,
        isPattern: false,
        default: null,
        typeAnnotation: param.has('typeAnnotation') ? param.get('typeAnnotation') : null
      });
    }
    else if (param.isArrayPattern() || param.isObjectPattern()) {
      simplified.push({
        path: param,
        name: `_arg${param.key}`,
        isRest: false,
        isPattern: true,
        default: path.get('right'),
        typeAnnotation: param.has('typeAnnotation') ? param.get('typeAnnotation') : null
      });
    }
  }
  return simplified.length === 0 ? false : simplified;
}
