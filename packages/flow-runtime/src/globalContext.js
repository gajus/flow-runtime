/* @flow */

import registerPrimitiveTypes from './registerPrimitiveTypes';
import registerBuiltinTypeHandlers from './registerBuiltinTypeHandlers';

import TypeContext from './TypeContext';

const globalContext = new TypeContext();
registerPrimitiveTypes(globalContext);
registerBuiltinTypeHandlers(globalContext);

export default globalContext;