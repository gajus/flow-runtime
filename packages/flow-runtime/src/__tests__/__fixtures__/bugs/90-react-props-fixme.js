/* @flow */

import React from 'react';
import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  class Foo extends React.Component<void, $FlowFixMe, void> {

  }

  return <Foo />;
}
