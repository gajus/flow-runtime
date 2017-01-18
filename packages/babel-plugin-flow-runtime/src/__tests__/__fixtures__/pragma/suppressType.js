/* @flow */

export const input = `
/* @flow */

type Demo = 123;

let oneTwoThree: Demo = 123;

(oneTwoThree: $FlowFixMe);

oneTwoThree = 456;
console.log(123, '=', oneTwoThree);
`;

export const expected = `
import t from "flow-runtime";
/* @flow */

const Demo = t.type("Demo", t.number(123));

let _oneTwoThreeType = Demo,
    oneTwoThree = _oneTwoThreeType.assert(123);

_oneTwoThreeType = t.any();
_oneTwoThreeType.assert(oneTwoThree);
oneTwoThree = _oneTwoThreeType.assert(456);
console.log(123, '=', oneTwoThree);

`;