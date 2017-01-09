/* @flow */

export const input = `
  import t from "flow-runtime";
  const pattern = t.pattern(
    (c: string, b: string) => {
      const d = c + b;
      return d.toUpperCase();
    },
    (a: boolean, c: number) => {
      const b = c > 0;
      return a && b ? "YES" : "NO";
    },
    (a: number, b: number, c: number) => {
      return a + b + c;
    },
    _ => _
  );
`;

export const expected = `
  import t from "flow-runtime";

  const pattern = (_arg0, _arg1, _arg2) => {
    if (typeof _arg0 === "string" && typeof _arg1 === "string") {
      const d = _arg0 + _arg1;
      return d.toUpperCase();
    }
    else if (typeof _arg0 === "boolean" && typeof _arg1 === "number") {
      const b = _arg1 > 0;
      return _arg0 && b ? "YES" : "NO";
    }
    else if (typeof _arg0 === "number" && typeof _arg1 === "number" && typeof _arg2 === "number") {
      return _arg0 + _arg1 + _arg2;
    }
    else {
      return _arg0;
    }
  };
`;