/* @flow */

export const input = `
  interface B {
    (): string;
  }

  interface A extends B {
    prop: number;
  }

  let a: A;

  let val = function() {};
  val.prop = 1;

  // assignment 1
  a = val;

  // assignment 2
  a = { prop: 1 };

`;

export const expected = `
  import t from "flow-runtime";
  const B = t.type("B", t.object(t.callProperty(t.function(t.return(t.string())))));
  const A = t.type("A", t.spread(B, t.object(t.property("prop", t.number()))));


  let _aType = A,
      a;

  let val = function () {};
  val.prop = 1;

  // assignment 1
  a = _aType.assert(val);

  // assignment 2
  a = _aType.assert({ prop: 1 });
`;