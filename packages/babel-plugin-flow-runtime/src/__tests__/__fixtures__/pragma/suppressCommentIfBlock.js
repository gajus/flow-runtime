/* @flow */

export const input = `
/* @flow */

type Demo = false;

// $FlowFixMe
if (true) {
  console.log((false: true));
}
else {
  console.log((true: Demo));
}
`;

export const expected = `
import t from "flow-runtime";
/* @flow */

const Demo = t.type("Demo", t.boolean(false));

// $FlowFixMe
if (true) {
  console.log(false);
}
else {
  console.log(true);
}
`;