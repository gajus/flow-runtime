/* @flow */

export const input = `
  import rt, { reify } from "flow-runtime";
  import type { Type } from "flow-runtime";
  type Demo = number;
  console.log((reify: Type<Demo>));
`;

export const expected = `
  import rt, { reify } from "flow-runtime";
  import { Type as _Type } from "flow-runtime";
  const Type = rt.tdz(() => _Type);
  const Demo = rt.type("Demo", rt.number());
  console.log(Demo);
`;

export const customRuntime = `
  import rt, { reify } from "flow-runtime";
  import { Type as _Type } from "flow-runtime";
  const Type = rt.tdz(() => _Type);
  const Demo = rt.type("Demo", rt.number());
  console.log(Demo);
`;
