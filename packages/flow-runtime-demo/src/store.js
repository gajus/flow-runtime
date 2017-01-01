/* @flow */

const Worker: any = require("./compiler.worker");

import {observable} from 'mobx';


export class Store {
  @observable code = localStorage.getItem('code') || '';
  @observable transformed = "";

  worker: Worker;

  timerId: ? number = null;

  constructor () {
    const worker = new Worker();
    worker.onmessage = (event) => {
      this.transformed = event.data;
    };
    this.worker = worker;
    this.updateCode(this.code);
  }

  updateCode (code: string) {
    this.code = code;
    if (this.timerId === null) {
      this.timerId = setTimeout(
        () => {
          const code = this.code;
          localStorage.setItem('code', code);
          this.worker.postMessage(code);
          this.timerId = null;
        },
        50
      );
    }
  }
}

export default new Store();