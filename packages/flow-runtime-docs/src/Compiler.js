/* @flow */
import t from 'flow-runtime';
import * as flowConfigParser from 'flow-config-parser';
import React from 'react';
import ReactDOM from 'react-dom';
import {observable, computed} from 'mobx';

const sharedState = observable({
  isReady: false
});

const Worker: any = require("./compiler.worker");

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (t: T) => void;
  reject: (e: Error) => void;
};

let SEQUENCE = 0;
const queue: {[key: number]: Deferred<any>} = {};

const sharedWorker = new Worker();
sharedWorker.onmessage = (event: Event) => {
  sharedState.isReady = true;
  const [id, transformed, compiled, errorMessage] = event.data;
  const deferred = queue[id];
  if (!deferred) {
    return;
  }
  delete queue[id];
  if (errorMessage) {
    deferred.reject(new Error(errorMessage));
  }
  else {
    deferred.resolve([transformed, compiled]);
  }
};

function defer <T> (): Deferred<T> {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject
  });
  return deferred;
}

function compile (code: string, options: Object): Promise<[string, string]> {
  let id = SEQUENCE++;
  const deferred = defer();
  queue[id] = deferred;
  sharedWorker.postMessage([id, code, options]);
  return deferred.promise;
}

export default class Compiler {
  @observable code: string;
  @observable transformed: string;
  @observable compiled: string;
  @observable shouldAssert: boolean;
  @observable shouldWarn: boolean;
  @observable shouldDecorate: boolean;
  @observable error: string;
  @observable log: Array<['log' | 'warn' | 'error' | 'react', string]> = [];

  @computed get isReady (): boolean {
    return sharedState.isReady;
  }

  fakeConsole = Object.setPrototypeOf({
    log: (...args: any[]) => {
      console.log(...args);
      this.log.push(['log', args.map(String).join(' ')]);
    },
    warn: (...args: any[]) => {
      console.warn(...args);
      this.log.push(['warn', args.map(String).join(' ')]);
    },
    error: (...args: any[]) => {
      console.error(...args);
      this.log.push(['error', args.map(String).join(' ')]);
    }
  }, console);

  constructor (code: string) {
    this.code = code;
    this.transformed = '';
    this.compiled = '';
    this.error = '';
    this.shouldDecorate = true;
    this.shouldAssert = true;
    this.shouldWarn = false;
    this.updateCode(this.code);
  }

  async updateCode (code: string) {
    this.code = code;
    try {
      const [transformed, compiled] = await compile(code, {
        assert: this.shouldAssert,
        decorate: this.shouldDecorate,
        warn: this.shouldWarn
      });

      this.transformed = transformed;
      this.compiled = compiled;
      this.error = '';
    }
    catch (e) {
      this.error = e.message;
    }
  }

  run (): any {
    this.log = [];
    const fn = new Function('console', 'module', 'exports', 'require', this.compiled); // eslint-disable-line
    const exports = {};
    const module = {exports};
    const originalEmit = t.emitWarningMessage;
    t.emitWarningMessage = (message: string) => this.fakeConsole.warn(message);
    try {
      const result: any = fn(this.fakeConsole, module, exports, (name) => {
        switch (name) {
          case 'flow-runtime':
            return t;
          case 'flow-config-parser':
            return flowConfigParser;
          case 'react':
            return React;
          case 'react-dom':
            return ReactDOM;
          default:
            throw new Error('Imports are not supported.');
        }
      });
      // @flowIssue 252
      if (result && typeof result.$$typeof === 'symbol') {
        this.log.push(['react', result]);
      }
      else if (result !== undefined) {
        this.fakeConsole.log(result);
      }
      return result;
    }
    catch (e) {
      this.fakeConsole.error(e.stack);
    }
    t.emitWarningMessage = originalEmit;
  }
}

