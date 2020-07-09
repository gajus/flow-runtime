/* @flow */

import React from 'react';

import {UnControlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

type Props = {
  value: string,
};

export default class CodeOutput extends React.Component<Props, void> {
  render() {
    const options = {
      lineNumbers: true,
      mode: 'javascript',
      tabSize: 2,
      readOnly: true,
    };
    return (
      <CodeMirror
        value={this.props.value}
        options={options}
        autoCursor={false}
        autoScroll={false}
      />
    );
  }
}
