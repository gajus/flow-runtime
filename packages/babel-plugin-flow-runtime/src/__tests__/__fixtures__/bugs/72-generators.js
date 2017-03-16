/* @flow */

export const input = `
type Options = {};

export const makeApiCallSaga = (opts: Options) => {
  return function* apiCallWatcherSaga (): Generator<*, void, *> {
  };
};
`;

export const expected = `
import t from "flow-runtime";
const Options = t.type("Options", t.object());

export const makeApiCallSaga = opts => {
  let _optsType = Options;
  t.param("opts", _optsType).assert(opts);
  return function* apiCallWatcherSaga() {
    const _yieldType = t.existential();
    const _nextType = t.existential();
    const _returnType = t.return(t.void());
  };
};
`;


export const annotated = `
import t from "flow-runtime";
const Options = t.type("Options", t.object());

export const makeApiCallSaga = t.annotate(
  function makeApiCallSaga(opts) {
    return t.annotate(
      function* apiCallWatcherSaga() {},
      t.function(t.return(t.ref("Generator", t.existential(), t.void(), t.existential())))
    );
  },
  t.function(t.param("opts", Options))
);
`;

export const combined = `
import t from "flow-runtime";
const Options = t.type("Options", t.object());

export const makeApiCallSaga = t.annotate(
  function makeApiCallSaga(opts) {
    let _optsType = Options;
    t.param("opts", _optsType).assert(opts);
    return t.annotate(
      function* apiCallWatcherSaga() {
        const _yieldType = t.existential();
        const _nextType = t.existential();
        const _returnType = t.return(t.void());
      },
      t.function(t.return(t.ref("Generator", t.existential(), t.void(), t.existential())))
    );
  },
  t.function(t.param("opts", Options))
);
`;
