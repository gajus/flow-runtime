/* @flow */

import React, { Component } from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';

import CodeMirror from './CodeMirror';
import FakeConsole from './FakeConsole';


import Compiler from '../Compiler';

type Props = {
  inline?: boolean;
  inputTitle?: *;
  outputTitle?: *;
  hideOutput?: boolean;
  code: string;
};

@observer
export default class Example extends Component<Props, void> {

  @observable compiler: Compiler;

  handleChange = (code: string) => {
    this.compiler.updateCode(code);
  };

  runCode = () => {
    this.compiler.run();
  };

  constructor (props: Props) {
    super(props);
    this.compiler = new Compiler(props.code);
  }


  render () {
    const compiler = this.compiler;
    const {inputTitle, outputTitle, inline, hideOutput} = this.props;
    const className = compiler.error ? 'syntax-error' : 'no-error';
    const input = (
      <div>
        {inputTitle}
        <CodeMirror value={compiler.code} onChange={this.handleChange} />
      </div>
    );

    const output = (
      <div>
        {outputTitle}
        <CodeMirror value={compiler.transformed} readOnly />
        <br />
        <button className="btn btn-primary" onClick={this.runCode} disabled={!compiler.isReady}>
          {!compiler.isReady && <i className="fas fa-spinner fa-pulse" />}
          {!compiler.isReady ? ' Starting compiler...' : 'Run'}
        </button>
      </div>
    );
    if (inline) {
      return (
        <div className={className}>
          {input}
          <br />
          {!hideOutput && output}
          {hideOutput && (
            <button className="btn btn-primary" onClick={this.runCode} disabled={!compiler.isReady}>
              {!compiler.isReady && <i className="fas fa-spinner fa-pulse" />}
              {!compiler.isReady ? ' Starting compiler...' : 'Run'}
            </button>
          )}
          {hideOutput && <br />}
          <br />
          <FakeConsole compiler={compiler} />
        </div>
      );
    }
    return (
      <div className={className}>
        <div className="row">
          <div className="col-sm-6">
            {input}
          </div>
          <div className="col-sm-6">
            {output}
          </div>
        </div>
        <br />
        <FakeConsole compiler={compiler} />
      </div>
    );
  }
}
