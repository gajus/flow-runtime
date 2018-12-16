/* @flow */

import _fs from 'fs';

export const fs: Object = Object.keys(_fs).reduce((memo, key) => {
  memo[`${key}Async`] = promisify(_fs[key]);
  return memo;
}, {});

export function promisify(fn: Function) {
  return function (...args: Array<any>): Promise<any> {
    return new Promise(function (resolve, reject) {
      function callback (err, data) {
        if (err) return reject(err);
        resolve(data);
      }
      fn(...[...args, callback]);
    });
  };
}
