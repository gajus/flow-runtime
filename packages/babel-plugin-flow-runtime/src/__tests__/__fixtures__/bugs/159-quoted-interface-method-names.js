/* @flow */

export const input = `
  interface A {
    "a"(): number;
    "b"(): string;
  }
`;

export const expected = `
  import t from "flow-runtime";
  const A = t.type("A", t.object(t.property("a", t.function(t.return(t.number()))), t.property("b", t.function(t.return(t.string())))));
`;
