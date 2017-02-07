/* @flow */

import errorMessages from './errorMessages';
import type {ErrorKey} from './errorMessages';


export default function getErrorMessage (key: ErrorKey, ...params: any[]): string {
  const message = errorMessages[key];
  if (params.length > 0) {
    return message.replace(/\$(\d+)/g, (m, i) => String(params[i]));
  }
  else {
    return message;
  }
}


