/* @flow */

export const input = `
  import t from "flow-runtime";
  console.log(t.match("foo", [
    (input: string) => input,
    (...input: boolean[]) => input,
    _ => _
  ]));
`;

export const expected = `
  import t from "flow-runtime";

  console.log(((..._arg0) => {
    if (typeof _arg0[0] === "string") {
      return _arg0[0];
    }
    else if (t.array(t.boolean()).accepts(_arg0)) {
      return _arg0;
    }
    else {
      return _arg0[0];
    }
  })("foo"));
`;