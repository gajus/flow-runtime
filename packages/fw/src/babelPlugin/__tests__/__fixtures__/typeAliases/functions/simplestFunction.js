/* @flow */

export const input = `
  type Demo = () => void;
`;

export const expected = `
  import t from "runtime-types";
  const Demo = t.type("Demo", t.function(t.return(t.void())));
`;