/* @flow */

import type {TypeContext} from 'flow-runtime';
import type {
  isObservableArray,
  isObservableMap,
} from 'mobx';

type Mobx = {
  isObservableArray: isObservableArray,
  isObservableMap: isObservableMap,
};

const alreadyDecorated = new WeakSet();

export default function registerMobxTypes (context: TypeContext, mobx: Mobx) {
  if (alreadyDecorated.has(context)) {
    return;
  }
  const originalArrayPredicate = context.getPredicate('Array');
  const originalMapPredicate = context.getPredicate('Map');

  context.setPredicate('Array', (input: any): boolean => {
    if (originalArrayPredicate(input)) {
      return true;
    }
    else {
      return mobx.isObservableArray(input);
    }
  });

  context.setPredicate('Map', (input: any): boolean => {
    if (originalMapPredicate(input)) {
      return true;
    }
    else {
      return mobx.isObservableMap(input);
    }
  });

  alreadyDecorated.add(context);

}