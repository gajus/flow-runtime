/* @flow */

import React from 'react';
import {observer} from 'mobx-react';

import ReactCodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

type Props = {
  onChange?: (code: string) => any;
  readOnly?: boolean;
  value: string;
};

@observer
export default class CodeMirror extends React.Component<void, Props, void> {

  handleChange = (code: string) => {
    const {onChange} = this.props;
    if (onChange) {
      onChange(code);
    }
  };

  render () {
    const {value, readOnly} = this.props;
    const options = {
      lineNumbers: true,
      mode: 'javascript',
      tabSize: 2,
      readOnly: readOnly ? true : false
    };
    return (
        <ReactCodeMirror value={value} onChange={this.handleChange} options={options} />
    );
  }
}