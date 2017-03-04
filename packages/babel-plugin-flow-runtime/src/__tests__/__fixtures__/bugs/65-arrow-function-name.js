/* @flow */

export const input = `
const fn = (a: string): string => a;
`;

export const expected = `
import t from "flow-runtime";
const fn = a => {
  let _aType = t.string();
  const _returnType = t.return(t.string());
  t.param("a", _aType).assert(a);
  return _returnType.assert(a);
};
`;


export const annotated = `
import t from "flow-runtime";
const fn = t.annotate(
  function fn(a) {
    return a;
  },
  t.function(t.param("a", t.string()), t.return(t.string()))
);
`;
