/* @flow */

export const input = `
  import t from "flow-runtime";
  const pattern = t.pattern(
    (input: string) => input.toUpperCase(),
    (input: boolean | number) => input ? "YES" : "NO",
    _ => _
  );
`;

export const expected = `
  import t from "flow-runtime";

  const pattern = _arg0 => {
    if (typeof _arg0 === "string") {
      return _arg0.toUpperCase();
    }
    else if (typeof _arg0 === "boolean" || typeof _arg0 === "number") {
      return _arg0 ? "YES" : "NO";
    }
    else {
      return _arg0;
    }
  };
`;