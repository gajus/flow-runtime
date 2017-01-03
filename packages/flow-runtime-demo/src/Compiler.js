/* @flow */
import t from 'flow-runtime';
import React from 'react';
import ReactDOM from 'react-dom';

const Worker: any = require("./compiler.worker");
import {observable} from 'mobx';


export default class Compiler {
  @observable code: string;
  @observable transformed: string;
  @observable compiled: string;
  @observable log: Array<['log' | 'warn' | 'error', string]> = [];

  worker: Worker;

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
    this.worker = new Worker();
    this.worker.onmessage = (event) => {
      const [transformed, compiled] = event.data;
      this.transformed = transformed;
      this.compiled = compiled;
    };
    this.updateCode(this.code);
  }

  updateCode (code: string) {
    this.code = code;
    this.worker.postMessage(code);
  }

  run () {
    this.log = [];
    const fn = new Function('console', 'module', 'exports', 'require', this.compiled); // eslint-disable-line
    const exports = {};
    const module = {exports};
    try {
      return fn(this.fakeConsole, module, exports, (name) => {
        switch (name) {
          case 'flow-runtime':
            return t;
          case 'react':
            return React;
          case 'react-dom':
            return ReactDOM;
          default:
            throw new Error('Imports are not supported.');
        }
      });
    }
    catch (e) {
      this.fakeConsole.error(e.stack);
    }
  }
}

