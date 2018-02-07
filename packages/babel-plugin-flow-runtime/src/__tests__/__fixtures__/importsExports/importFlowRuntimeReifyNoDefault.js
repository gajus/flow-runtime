/* @flow */

export const input = `
  import { reify } from "flow-runtime";
  import type { Type } from "flow-runtime";
  type Demo = number;
  console.log((reify: Type<Demo>));
`;

export const expected = `
  import { reify } from "flow-runtime";
  import { Type as _Type } from "flow-runtime";
  import t from "flow-runtime";
  const Type = t.tdz(() => _Type);
  const Demo = t.type("Demo", t.number());
  console.log(Demo);
`;

export const customRuntime = `
  import { reify } from "flow-runtime";
  import { Type as _Type } from "flow-runtime";
  import t from "./custom-flow-runtime";
  const Type = t.tdz(() => _Type);
  const Demo = t.type("Demo", t.number());
  console.log(Demo);
`;
