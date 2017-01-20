/* @flow */

export const input = `
/* @flow */
function* oneTwoThree (): Iterable<number> {
  yield 1;
}
`;

export const expected = `
import t from "flow-runtime";
/* @flow */

function* oneTwoThree() {
  const _yieldType = t.number();
  yield _yieldType.assert(1);
}

`;


export const annotated = `
import t from "flow-runtime";
/* @flow */

function* oneTwoThree() {
  yield 1;
}

t.annotate(oneTwoThree, t.function(t.return(t.ref("Iterable", t.number()))));
`;