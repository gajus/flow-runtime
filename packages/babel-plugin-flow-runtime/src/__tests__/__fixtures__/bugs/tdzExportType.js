/* @flow */

export const input = `
  function demo (): Thing {
    return "ok";
  }

  export type Thing = string;
`;

export const expected = `
  import t from "flow-runtime";
  function demo() {
    const _returnType = t.return(t.tdz(() => Thing, "Thing"));
    return _returnType.assert("ok");
  }

  export const Thing = t.type("Thing", t.string());
`;

export const annotated = `
  import t from "flow-runtime";
  function demo() {
    return "ok";
  }
  t.annotate(
    demo,
    t.function(t.return(t.tdz(() => Thing, "Thing")))
  );

  export const Thing = t.type("Thing", t.string());
`;


export const combined = `
  import t from "flow-runtime";
  function demo() {
    const _returnType = t.return(t.tdz(() => Thing, "Thing"));
    return _returnType.assert("ok");
  }
  t.annotate(
    demo,
    t.function(t.return(t.tdz(() => Thing, "Thing")))
  );

  export const Thing = t.type("Thing", t.string());
`;