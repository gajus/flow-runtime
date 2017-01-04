/* @flow */

import React, { Component } from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';

import CodeMirror from './CodeMirror';

import FakeConsole from './FakeConsole';

import Compiler from '../Compiler';

type Props = {};

const defaultExample = `
type Thing = {
  id: string | number;
  name: string;
};

const widget: Thing = {
  id: false,
  name: 'Widget'
};

console.log(widget);
`.trim();

@observer
export default class TryPage extends Component<void, Props, void> {

  @observable compiler: Compiler;

  handleChange = (code: string) => {
    this.compiler.updateCode(code);
  };

  runCode = () => {
    this.compiler.run();
  };

  hideLog = (e: Event) => {
    e.preventDefault();
    this.compiler.log = [];
  };

  handleClickAssertions = () => {
    this.compiler.shouldAssert = !this.compiler.shouldAssert;
    this.compiler.updateCode(this.compiler.code);
  };


  handleClickDecoration = () => {
    this.compiler.shouldDecorate = !this.compiler.shouldDecorate;
    this.compiler.updateCode(this.compiler.code);
  };

  constructor (props: Props) {
    super(props);
    this.compiler = new Compiler(defaultExample, 'try');
  }


  render () {
    const compiler = this.compiler;
    return (
      <div className="container-fluid">
      <div className="btn-toolbar bg-faded">
          <div className="btn-group float-sm-right">
            <button className="btn btn-secondary" onClick={this.handleClickAssertions}>
              {compiler.shouldAssert ? 'Disable Assertions' : 'Enable Assertions'}
            </button>
            <button className="btn btn-secondary" onClick={this.handleClickDecoration}>
              {compiler.shouldDecorate ? 'Disable Decorations' : 'Enable Decorations'}
            </button>
            <button className="btn btn-primary" onClick={this.runCode} disabled={!compiler.isReady}>
              {!compiler.isReady && <i className="fa fa-spinner fa-pulse" />}
              {!compiler.isReady ? ' Starting compiler...' : 'Run'}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 no-gutter">
            <CodeMirror value={compiler.code} onChange={this.handleChange} />
          </div>
          <div className="col-sm-6 no-gutter">
            <hr className="hidden-sm-up" />
            <CodeMirror value={compiler.transformed} readOnly />
            <br />
            <FakeConsole compiler={compiler} style={{
              position: 'fixed',
              bottom: 0,
              width: '80%',
              left: 'calc(20% / 2)',
              zIndex: 99999
            }}/>
          </div>
        </div>
      </div>
    );
  }
}

