/* @flow */

import ConversionContext from './ConversionContext';

export type Options = {
  ignore?: boolean;
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

  context.shouldDecorate = options.decorate === 'undefined'
                         ? true
                         : Boolean(options.decorate)
                         ;
  return context;
}