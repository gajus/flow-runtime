/* @flow */

export const input = `
  import t from "flow-runtime";
  const pattern = t.pattern(
    ([input]: string[]) => input.toUpperCase(),
    (...items: string[]) => items.length,
    _ => _
  );
`;

export const expected = `
  import t from "flow-runtime";

  const pattern = (..._arg0) => {
    if (t.array(t.string()).accepts(_arg0[0])) {
      let [input] = _arg0[0];
      return input.toUpperCase();
    }
    else if (t.array(t.string()).accepts(_arg0)) {
      return _arg0.length;
    }
    else {
      return _arg0[0];
    }
  };
`;