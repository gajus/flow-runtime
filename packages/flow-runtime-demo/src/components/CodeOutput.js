/* @flow */

import React from 'react';

import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

type Props = {
  value: string;
};

export default class CodeOutput extends React.Component<void, Props, void> {
  render () {
    const options = {
      lineNumbers: true,
      mode: 'javascript',
      tabSize: 2,
      readOnly: true
    };
    return (
        <CodeMirror value={this.props.value} options={options} />
    );
  }
}