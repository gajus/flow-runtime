/* @flow */

export const input = `
  import t from "flow-runtime";
  console.log(t.match("foo", "bar", [
    (input: string) => input,
    (foo: string, bar: number, ...input: boolean[]) => input,
    (foo: string, ...extra: number[]) => foo,
    (foo: string, bar: string, baz: string, qux: string) => foo,
    _ => _
  ]));
`;

export const expected = `
  import t from "flow-runtime";

  console.log(((_arg0, ..._arg1) => {
    const _input = _arg1.slice(1);
    if (typeof _arg0 === "string") {
      return _arg0;
    }
    else if (typeof _arg0 === "string" && typeof _arg1[0] === "number" && t.array(t.boolean()).accepts(_input)) {
      return _input;
    }
    else if (typeof _arg0 === "string" && t.array(t.number()).accepts(_arg1)) {
      return _arg0;
    }
    else if (typeof _arg0 === "string" && typeof _arg1[0] === "string" && typeof _arg1[1] === "string" && typeof _arg1[2] === "string") {
      return _arg0;
    }
    else {
      return _arg0;
    }
  })("foo", "bar"));
`;