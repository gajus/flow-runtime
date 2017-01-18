/* @flow */

export const input = `
  import t from "flow-runtime";
  const pattern = t.pattern(
    (input: string) => input.toUpperCase(),
    (input: boolean, b: number) => input && b > 0 ? "YES" : "NO",
    _ => _
  );
`;

export const expected = `
  import t from "flow-runtime";

  const pattern = (_arg0, _arg1) => {
    if (typeof _arg0 === "string") {
      return _arg0.toUpperCase();
    }
    else if (typeof _arg0 === "boolean" && typeof _arg1 === "number") {
      return _arg0 && _arg1 > 0 ? "YES" : "NO";
    }
    else {
      return _arg0;
    }
  };
`;