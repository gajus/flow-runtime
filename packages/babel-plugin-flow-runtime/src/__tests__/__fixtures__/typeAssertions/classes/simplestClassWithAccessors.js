/* @flow */

export const input = `
  class Point {
    x: number = 0;
    y: number = 0;

    get foo (): boolean {
      return true;
    }
  }
`;

export const expected = `
  import t from "flow-runtime";

  class Point {
    @t.decorate(t.number())
    x = 0;

    @t.decorate(t.number())
    y = 0;

    get foo() {
      const _returnType = t.return(t.boolean());
      return _returnType.assert(true);
    }
  }
`;