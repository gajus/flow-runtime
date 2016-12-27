/* @flow */

import registerPrimitiveTypes from './registerPrimitiveTypes';
import registerBuiltinTypeConstructors from './registerBuiltins';

import TypeContext from './TypeContext';

const globalContext = new TypeContext();
registerPrimitiveTypes(globalContext);
registerBuiltinTypeConstructors(globalContext);

export default globalContext;