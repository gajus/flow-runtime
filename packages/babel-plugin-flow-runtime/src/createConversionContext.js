/* @flow */

import ConversionContext from './ConversionContext';

export type Options = {
  ignore?: boolean;
  assert?: boolean;
  warn?: boolean;
  annotate?: boolean;
  // deprecated
  decorate?: boolean;
};

export default function createConversionContext (options: Options): ConversionContext {

  const context = new ConversionContext();

  context.shouldAssert = options.assert === undefined
                       ? process.env.NODE_ENV === 'development'
                       : Boolean(options.assert)
                       ;

  context.shouldWarn = options.warn ? true : false;

  if ('decorate' in options) {
    console.warn('Warning: "decorate" option for babel-plugin-flow-runtime is now called "annotate", support for "decorate" will be removed in a future version.');
    if (!('annotate' in options)) {
      options.annotate = options.decorate;
    }
  }

  context.shouldAnnotate = options.annotate === undefined
                         ? true
                         : Boolean(options.annotate)
                         ;
  return context;
}