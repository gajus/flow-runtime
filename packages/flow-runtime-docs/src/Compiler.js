/* @flow */
import t from 'flow-runtime';
import flowRuntimeMobx from 'flow-runtime-mobx';
import * as flowConfigParser from 'flow-config-parser';
import * as validators from 'flow-runtime-validators';
import React from 'react';
import ReactDOM from 'react-dom';
import {observable, computed} from 'mobx';
import * as mobx from 'mobx';
import * as mobxReact from 'mobx-react';

const sharedState = observable({
  isReady: false
});

const Worker: any = require("./compiler.worker");
const cycles = new Set();

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (t: T) => void;
  reject: (e: Error) => void;
};

let SEQUENCE = 0;
const queue: {[key: number]: Deferred<any>} = {};

const sharedWorker = new Worker();
sharedWorker.onmessage = (event: MessageEvent) => {
  sharedState.isReady = true;
  const [id, transformed, compiled, errorMessage] = (event: any).data;
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

type FakeConsole = {
  log (...args: any[]): any;
  warn (...args: any[]): any;
  error (...args: any[]): any;
};

function makeFakeConsole (faker: FakeConsole): FakeConsole {
  Object.setPrototypeOf(faker, console);
  return faker;
}

function prepareLogItem (input: any): string {
  if (typeof input === 'function') {
    return `[[Function ${input.name || 'anonymous'}]]`;
  }
  else if (typeof input === 'string') {
    return JSON.stringify(input);
  }
  else if (input == null || typeof input !== 'object') {
    return String(input);
  }
  else if (cycles.has(input)) {
    return '[[Cyclic Reference]]';
  }
  cycles.add(input);
  let result;
  if (Array.isArray(input)) {
    if (input.length === 0) {
      result = '[]';
    }
    else {
      result = `[\n${indent(input.map(prepareLogItem).join(',\n'))}\n]`;
    }
  }
  else {
    const props = Object.keys(input).map(key => `${key}: ${prepareLogItem(input[key])}`);
    if (typeof input.constructor === 'function' && input.constructor !== Object) {
      if (props.length === 0) {
        result = `${input.constructor.name} {}`;
      }
      else {
        result = `${input.constructor.name} {\n${indent(props.join(',\n'))}\n}`;
      }
    }
    else if (props.length > 0) {
      result = `{\n${indent(props.join(',\n'))}\n}`
    }
    else {
      result = '{}';
    }
  }
  cycles.delete(input);
  return result;
}

function indent (input: string): string {
  const lines = input.split('\n');
  const {length} = lines;
  for (let i = 0; i < length; i++) {
    lines[i] = `  ${lines[i]}`;
  }
  return lines.join('\n');
}


export default class Compiler {
  @observable code: string;
  @observable transformed: string;
  @observable compiled: string;
  @observable shouldAssert: boolean;
  @observable shouldWarn: boolean;
  @observable shouldDecorate: boolean;
  @observable error: string;
  @observable.shallow log: Array<['log' | 'warn' | 'error' | 'react', string]> = [];

  @computed get isReady (): boolean {
    return sharedState.isReady;
  }

  fakeConsole: FakeConsole = makeFakeConsole({
    log: (...args: any[]) => {
      console.log(...args);
      this.log.push(['log', args.map(item => typeof item === 'string' ? item : prepareLogItem(item)).join(' ')]);
    },
    warn: (...args: any[]) => {
      console.warn(...args);
      this.log.push(['warn', args.map(item => typeof item === 'string' ? item : prepareLogItem(item)).join(' ')]);
    },
    error: (...args: any[]) => {
      console.error(...args);
      this.log.push(['error', args.map(item => typeof item === 'string' ? item : prepareLogItem(item)).join(' ')]);
    }
  });

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
    Object.defineProperty(t, 'emitWarningMessage', {
      configurable: true,
      value: (message: string) => this.fakeConsole.warn(message)
    });
    try {
      const result: any = fn(this.fakeConsole, module, exports, (name) => {
        switch (name) {
          case 'flow-runtime':
            return t;
          case 'flow-config-parser':
            return flowConfigParser;
          case 'flow-runtime-mobx':
            return flowRuntimeMobx;
          case 'flow-runtime-validators':
            return validators;
          case 'mobx':
            return mobx;
          case 'mobx-react':
            return mobxReact;
          case 'react':
            return React;
          case 'react-dom':
            return ReactDOM;
          default:
            throw new Error('Imports are not supported in the online demo.');
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
      this.fakeConsole.error(e.message);
    }
    Object.defineProperty(t, 'emitWarningMessage', {
      configurable: true,
      value: originalEmit
    });
  }
}

