/* @flow */

import ConversionContext from './ConversionContext';

export type Options = {
  assert?: boolean;
  warn?: boolean;
  decorate?: boolean;
};

export default function createConversionContext (options: Options): ConversionContext {

  const context = new ConversionContext();

  context.shouldAssert = options.assert === 'undefined'
                       ? process.env.NODE_ENV === 'development'
                       : Boolean(options.assert)
                       ;

  context.shouldWarn = options.warn ? true : false;

  const shouldCheck = context.shouldAssert || context.shouldWarn;

  context.shouldDecorate = options.decorate === 'undefined' || shouldCheck
                         ? true
                         : Boolean(options.decorate)
                         ;
  return context;
}