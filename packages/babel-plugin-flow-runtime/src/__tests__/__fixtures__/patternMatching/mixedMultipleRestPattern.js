/* @flow */

export const input = `
  import t from "flow-runtime";
  const pattern = t.pattern(
    (input: string) => input,
    (...input: boolean[]) => input,
    (foo: string, ...extra: number[]) => foo,
    _ => _
  );
`;

export const expected = `
  import t from "flow-runtime";

  const pattern = (..._arg0) => {
    if (typeof _arg0[0] === "string") {
      return _arg0[0];
    }
    else if (t.array(t.boolean()).accepts(_arg0)) {
      return _arg0;
    }
    else if (typeof _arg0[0] === "string" && t.array(t.number()).accepts(_arg0.slice(1))) {
      return _arg0[0];
    }
    else {
      return _arg0[0];
    }
  };
`;