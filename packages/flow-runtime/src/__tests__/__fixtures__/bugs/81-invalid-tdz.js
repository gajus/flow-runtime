/* @flow */

import type TypeContext from "../../../TypeContext";

export function pass(t: TypeContext) {
  const wares = {};

  function RequestQueue(_arg, requestDone) {
    let _requestDoneType = t.function(
      t.param("ctx", t.tdz(() => RequestContext)),
      t.return(t.any())
    );

    t.param("requestDone", _requestDoneType).assert(requestDone);

    return true;
  }

  const param = t.annotate(
    async function param(ctx) {
      let _ctxType = t.tdz(() => RequestContext);
      t.param("ctx", _ctxType).assert(ctx);
    },
    t.function(t.param("ctx", t.tdz(() => RequestContext)))
  );

  const RequestContext = t.type("RequestContext", t.object());

  const requestQueue = RequestQueue({ wares }, param);

  return requestQueue;
}

export function fail(t: TypeContext) {
  const wares = {};

  function RequestQueue(_arg, requestDone) {
    let _requestDoneType = t.function(
      t.param("ctx", t.tdz(() => RequestContext)),
      t.return(t.any())
    );

    t.param("requestDone", _requestDoneType).assert(requestDone);

    return true;
  }

  const param = t.annotate(
    async function param(ctx) {
      let _ctxType = t.tdz(() => RequestContext);
      t.param("ctx", _ctxType).assert(ctx);
    },
    t.function(t.param("ctx", t.tdz(() => t.string())))
  );

  const RequestContext = t.type("RequestContext", t.object());

  const requestQueue = RequestQueue({ wares }, param);

  return requestQueue;
}
