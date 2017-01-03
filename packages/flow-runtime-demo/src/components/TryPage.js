/* @flow */

import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';

import CodeInput from './CodeInput';
import CodeOutput from './CodeOutput';

import type {Store} from '../store';

type Props = {
  store: Store;
};

@inject('store')
@observer
export default class TryPage extends Component<void, Props, void> {
  render() {
    const store = this.props.store;
    return (
      <div className="TryPage">
        <div className="Wrapper">
          <CodeInput value={store.code} />
          <CodeOutput value={store.transformed} />
        </div>
      </div>
    );
  }
}

