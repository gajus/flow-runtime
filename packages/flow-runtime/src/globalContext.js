/* @flow */

import registerPrimitiveTypes from './registerPrimitiveTypes';
import registerBuiltinTypeConstructors from './registerBuiltins';
import registerTypePredicates from './registerTypePredicates';

import TypeContext from './TypeContext';

const globalContext = new TypeContext();
registerPrimitiveTypes(globalContext);
registerBuiltinTypeConstructors(globalContext);
registerTypePredicates(globalContext);


export default globalContext;