/* @flow */

const Worker: any = require("./compiler.worker");

import {observable} from 'mobx';


export class Store {
  id: string = 'default';
  @observable code: string;
  @observable transformed: string;

  worker: Worker;

  timerId: ? number = null;

  constructor (id: string) {
    this.id = id;
    this.code = localStorage.getItem(this.id + ':code') || '';
    this.transformed = '';
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
          localStorage.setItem(this.id + ':code', code);
          this.worker.postMessage(code);
          this.timerId = null;
        },
        50
      );
    }
  }
}

export default new Store('default');
