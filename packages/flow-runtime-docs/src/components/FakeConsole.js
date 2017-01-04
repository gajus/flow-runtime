/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';

import type Compiler from '../Compiler';

type Props = {
  compiler: Compiler;
};

@observer
export default class FakeConsole extends Component<void, Props, void> {


  hideLog = (e: Event) => {
    e.preventDefault();
    this.props.compiler.log = [];
  };

  render () {
    const {compiler, ...extra} = this.props;
    if (!compiler.log.length) {
      return <div />;
    }
    return (
      <div className="card" {...extra}>
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
            else if (type !== 'react') {
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

