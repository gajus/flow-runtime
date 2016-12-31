/* @flow */

export const input = `
  import { reify } from "flow-runtime";
  import type { Type } from "flow-runtime";
  type Demo = number;
  console.log((reify: Type<Demo>));
`;

export const expected = `
  import t from "flow-runtime";
  import { reify } from "flow-runtime";
  import { Type } from "flow-runtime";
  const Demo = t.type("Demo", t.number());
  console.log(Demo);
`;