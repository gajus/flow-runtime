/* @flow */

import _fs from 'fs';

export const fs: Object = Object.keys(_fs).reduce((memo, key) => {
  const item = _fs[key];
  if (typeof item === 'function') {
    memo[`${key}Async`] = promisify(item);
  }
  return memo;
}, {});

export function promisify (fn: Function) {
  return function (...args: Array<any>) {
    return new Promise(function (resolve, reject) {
      function callback (err, data) {
        if (err) return reject(err);
        resolve(data);
      }
      fn(...[...args, callback]);
    });
  };
}
