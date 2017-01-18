/* @flow */

export const input = `
/* @flow */

type Demo = false;

class Thing {
  // $FlowFixMe
  a: string;

  b: Demo;
}
`;

export const expected = `
import t from "flow-runtime";
/* @flow */

const Demo = t.type("Demo", t.boolean(false));

class Thing {
  // $FlowFixMe
  a;

  @t.decorate(Demo)
  b;
}
`;