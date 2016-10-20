/* @flow */

import registerSingletonTypes from './registerSingletonTypes';
import registerBuiltinTypeHandlers from './registerBuiltinTypeHandlers';

import TypeContext from './TypeContext';

const globalContext = new TypeContext();
registerSingletonTypes(globalContext);
registerBuiltinTypeHandlers(globalContext);

export default globalContext;