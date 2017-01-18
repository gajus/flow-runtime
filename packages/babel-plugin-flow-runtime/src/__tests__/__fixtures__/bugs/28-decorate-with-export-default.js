/* @flow */

export const input = `
export default function test(id: number): number {
  return id;
}
`;

export const expected = `
import t from "flow-runtime";
export default function test(id) {
  let _idType = t.number();
  const _returnType = t.return(t.number());
  t.param("id", _idType).assert(id);
  return _returnType.assert(id);
}
`;


export const annotated = `
import t from "flow-runtime";
export default function test(id) {
  return id;
}
t.annotate(
  test,
  t.function(
    t.param("id", t.number()),
    t.return(t.number())
  )
);
`;


export const combined = `
import t from "flow-runtime";
export default function test(id) {
  let _idType = t.number();
  const _returnType = t.return(t.number());
  t.param("id", _idType).assert(id);
  return _returnType.assert(id);
}
t.annotate(
  test,
  t.function(
    t.param("id", t.number()),
    t.return(t.number())
  )
);
`;