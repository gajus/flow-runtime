/* @flow */

export const input = `
function foo<X>() {
  let bar: X;
  return bar;
}
`;

export const expected = `
import t from "flow-runtime";
function foo() {
  const X = t.typeParameter("X");
  let _barType = X,
      bar;
  return bar;
}
`;

export const annotated = `
import t from "flow-runtime";
function foo() {
  let bar;
  return bar;
}
t.annotate(foo, t.function(_fn => {
  const X = _fn.typeParameter("X");
  return [];
}));
`;

