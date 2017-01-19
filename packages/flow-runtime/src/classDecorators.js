/* @flow */

import type Type from './types/Type';

type ValueDescriptor<T> = {
  writable: boolean;
  initializer?: () => T;
  enumerable: boolean;
  configurable: boolean;
};

type AccessorDescriptor<T> = {
  get: () => ? T;
  set: (value: T) => void;
  enumerable: boolean;
  configurable: boolean;
};

export type Descriptor<T>
 = AccessorDescriptor<T>
 | ValueDescriptor<T>
 ;

type TypeSource<T>
 = (() => Type<T>)
 | Type<T>
 ;

export function makePropertyDescriptor <O: {} | Function, T> (typeSource: TypeSource<T>, input: O, propertyName: string, descriptor: Descriptor<T>, shouldAssert: boolean): ? Descriptor<T> {
  if (typeof descriptor.get === 'function' && typeof descriptor.set === 'function') {
    return augmentExistingAccessors(typeSource, input, propertyName, (descriptor: $FlowIssue<AccessorDescriptor<T>>), shouldAssert);
  }
  else {
    return propertyToAccessor(typeSource, input, propertyName, (descriptor: $FlowIssue<ValueDescriptor<T>>), shouldAssert);
  }
}

function makePropertyName (name: string): string {
  return `_flowRuntime$${name}`;
}

function getClassName (input: Function | Object): string {
  if (typeof input === 'function') {
    return input.name || '[Class anonymous]';
  }
  else if (typeof input.constructor === 'function') {
    return getClassName(input.constructor);
  }
  else {
    return '[Class anonymous]';
  }
}

function resolveType <T> (receiver: any, typeSource: TypeSource<T>): Type<T> {
  if (typeof typeSource === 'function') {
    return typeSource.call(receiver);
  }
  else {
    return typeSource;
  }
}

function propertyToAccessor <O: {}, T> (typeSource: TypeSource<T>, input: O, propertyName: string, descriptor: ValueDescriptor<T>, shouldAssert: boolean): AccessorDescriptor<T> {
  const safeName = makePropertyName(propertyName);
  const className = getClassName(input);
  const {initializer, writable, ...config} = descriptor; // eslint-disable-line no-unused-vars

  const propertyPath = [className, propertyName];

  return {
    ...config,
    type: 'accessor',
    get (): ? T {
      if (safeName in this) {
        return (this: any)[safeName];
      }
      else if (initializer) {
        const type = resolveType(this, typeSource);
        const value = initializer.call(this);
        const context = type.context;
        context.check(type, value, 'Default value for property', propertyPath);
        Object.defineProperty(this, safeName, {
          writable: true,
          value: value
        });
        return value;
      }
      else {
        Object.defineProperty(this, safeName, {
          writable: true,
          value: undefined
        });
      }
    },
    set (value: T): void {
      const type = resolveType(this, typeSource);
      const context = type.context;
      if (shouldAssert) {
        context.assert(type, value, 'Property', propertyPath);
      }
      else {
        context.warn(type, value, 'Property', propertyPath);
      }
      if (safeName in this) {
        this[safeName] = value;
      }
      else {
        Object.defineProperty(this, safeName, {
          writable: true,
          value: value
        });
      }
    }
  };
}

function augmentExistingAccessors <O: {}, T> (typeSource: TypeSource<T>, input: O, propertyName: string, descriptor: AccessorDescriptor<T>, shouldAssert: boolean) {

  const className = getClassName(input);
  const propertyPath = [className, propertyName];

  const originalSetter = descriptor.set;

  descriptor.set = function set (value: T): void {
    const type = resolveType(this, typeSource);
    const context = type.context;
    if (shouldAssert) {
      context.assert(type, value, 'Property', propertyPath);
    }
    else {
      context.warn(type, value, 'Property', propertyPath);
    }
    originalSetter.call(this, value);
  };

}

