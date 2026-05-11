/* @flow */

export const input = `
  function foo<X>() {
    let bar: X;
  }
`;

export const expected = `
  import t from "flow-runtime";
  function foo() {
    const X = t.typeParameter("X");
    let _barType = X,
        bar;
  }
`;

export const annotated = `
  import t from "flow-runtime";
  function foo() {
    let bar;
  }
  t.annotate(foo, t.function(_fn => {
    const X = _fn.typeParameter("X");
    return [];
  }));
`;

export const combined = `
  import t from "flow-runtime";
  function foo() {
    const X = t.typeParameter("X");
    let _barType = X,
        bar;
  }
  t.annotate(foo, t.function(_fn => {
    const X = _fn.typeParameter("X");
    return [];
  }));
`;
