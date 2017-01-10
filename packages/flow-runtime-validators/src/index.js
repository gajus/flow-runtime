/* @flow */

import * as validators from './validators';

import compose from './composeValidators';

export type Validator = (input: any) => ? string;

export {validators, compose};
