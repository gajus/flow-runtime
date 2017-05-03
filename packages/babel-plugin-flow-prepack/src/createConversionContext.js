/* @flow */

import ConversionContext from './ConversionContext';

export type Options = {
  ignore?: boolean;
  suppressComments?: string[];
  suppressTypes?: string[];
};

export default function createConversionContext (options: Options): ConversionContext {

  const context = new ConversionContext();

  if ('suppressComments' in options && Array.isArray(options.suppressComments)) {
    context.suppressCommentPatterns = options.suppressComments.map(regexString => new RegExp(regexString));
  }

  if ('suppressTypes' in options && Array.isArray(options.suppressTypes)) {
    context.suppressTypeNames = options.suppressTypes;
  }

  return context;
}
