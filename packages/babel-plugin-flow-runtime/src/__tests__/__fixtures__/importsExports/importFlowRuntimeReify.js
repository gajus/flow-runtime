/* @flow */

export const input = `
  import rt, { reify } from "flow-runtime";
  import type { Type } from "flow-runtime";
  type Demo = number;
  console.log((reify: Type<Demo>));
`;

export const expected = `
  import rt, { reify } from "flow-runtime";
  import { Type } from "flow-runtime";
  const Demo = rt.type("Demo", rt.number());
  console.log(Demo);
`;