/* @flow */

import type {ErrorTuple} from '../Validation';

export default class RuntimeTypeError extends TypeError {
  name: string = "RuntimeTypeError";
  errors: ?ErrorTuple[];
  constructor(message: string, options?: {errors?: ErrorTuple[]}) {
    super(message);
    Object.assign(this, options);
  }
}