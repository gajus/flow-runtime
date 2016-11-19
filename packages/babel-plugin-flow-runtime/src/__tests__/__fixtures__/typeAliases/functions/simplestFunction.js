/* @flow */

export const input = `
  type Demo = () => void;
`;

export const expected = `
  import t from "flow-runtime";
  const Demo = t.type("Demo", t.function(t.return(t.void())));
`;