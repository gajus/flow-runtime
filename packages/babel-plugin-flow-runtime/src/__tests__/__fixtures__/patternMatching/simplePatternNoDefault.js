/* @flow */

export const input = `
  import t from "flow-runtime";
  const pattern = t.pattern(
    (input: null) => "NULL",
    (input: string) => input.toUpperCase(),
    (input: boolean) => input ? "YES" : "NO",
  );
`;

export const expected = `
  import t from "flow-runtime";

  const pattern = _arg0 => {
    if (_arg0 === null) {
      return "NULL";
    }
    else if (typeof _arg0 === "string") {
      return _arg0.toUpperCase();
    }
    else if (typeof _arg0 === "boolean") {
      return _arg0 ? "YES" : "NO";
    }
    else {
      const error = new TypeError(
        "Value did not match any of the candidates, expected:\\n\\n    null\\nor:\\n string\\nor:\\n boolean\\n"
      );
      error.name = "RuntimeTypeError";
      throw error;
    }
  };
`;