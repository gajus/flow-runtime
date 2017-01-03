/* @flow */

import React, { Component } from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';

import CodeMirror from './CodeMirror';


import Compiler from '../Compiler';

type Props = {
  inline?: boolean;
  inputTitle?: *;
  outputTitle?: *;
  code: string;
};

@observer
export default class Example extends Component<void, Props, void> {

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

  constructor (props: Props) {
    super(props);
    this.compiler = new Compiler(props.code);
  }


  render () {
    const compiler = this.compiler;
    const {inputTitle, outputTitle, inline} = this.props;
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
        <button className="btn btn-primary" onClick={this.runCode}>
          Run
        </button>
      </div>
    );
    if (inline) {
      return (
        <div>
          {input}
          <br />
          {output}
          <br />
          {this.renderLog()}
        </div>
      );
    }
    return (
      <div>
        <div className="row">
          <div className="col-sm-6">
            {input}
          </div>
          <div className="col-sm-6">
            {output}
          </div>
        </div>
        <br />
        {this.renderLog()}
      </div>
    );
  }

  renderLog () {
    const compiler = this.compiler;
    if (!compiler.log.length) {
      return;
    }
    return (
      <div className="card">
        <div className="card-block">
          <button type="button"
                  className="close"
                  aria-label="Close"
                  onClick={this.hideLog}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 className="card-title">Output</h4>
          <hr />
          <pre>
          {compiler.log.map(([type, line], index) => {
            let className, icon;
            if (type === 'warn') {
              className = 'text-warning';
              icon = <i className="fa fa-exclamation-triangle" />;
            }
            else if (type === 'error') {
              className = 'text-danger';
              icon = <i className="fa fa-times-circle" />;
            }
            else {
              className = 'text-muted';
            }
            return (
              <div key={index} className={className}>
                {icon}
                {icon && ' '}
                {line}
              </div>
            );
          })}
          </pre>
        </div>
      </div>
    );
  }
}

