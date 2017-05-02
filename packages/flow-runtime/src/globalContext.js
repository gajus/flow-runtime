/* @flow */

import registerPrimitiveTypes from './registerPrimitiveTypes';
import registerBuiltinTypeConstructors from './registerBuiltins';
import registerTypePredicates from './registerTypePredicates';

import TypeContext from './TypeContext';

let globalContext;
if (typeof global !== 'undefined' && typeof global.__FLOW_RUNTIME_GLOBAL_CONTEXT_DO_NOT_USE_THIS_VARIABLE__ !== 'undefined') {
  globalContext = global.__FLOW_RUNTIME_GLOBAL_CONTEXT_DO_NOT_USE_THIS_VARIABLE__;
}
else {
  globalContext = new TypeContext();
  registerPrimitiveTypes(globalContext);
  registerBuiltinTypeConstructors(globalContext);
  registerTypePredicates(globalContext);
  if (typeof global !== 'undefined') {
    global.__FLOW_RUNTIME_GLOBAL_CONTEXT_DO_NOT_USE_THIS_VARIABLE__ = globalContext;
  }
}


export default globalContext;