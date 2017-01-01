/* @flow */

import React from 'react';
import {observer, inject} from 'mobx-react';

import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

import type {Store} from '../store';

type Props = {
  value: string;
  store?: Store;
};

@inject('store')
@observer
export default class CodeInput extends React.Component<void, Props, void> {
  handleChange = (code: string) => {
    const {store} = this.props;
    if (store) {
      store.updateCode(code);
    }
  }
  render () {
    const options = {
      lineNumbers: true,
      mode: 'javascript',
      tabSize: 2
    };
    return (
        <CodeMirror value={this.props.value} onChange={this.handleChange} options={options} />
    );
  }
}