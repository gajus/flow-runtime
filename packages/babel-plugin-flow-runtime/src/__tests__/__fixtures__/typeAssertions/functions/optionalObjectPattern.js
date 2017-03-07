/* @flow */

export const input = `
  const demo = ({foo}?: {foo: string}): string => foo;
`;

export const expected = `
  import t from "flow-runtime";
  const demo = (_arg?) => {
    const _returnType = t.return(t.string());
    let { foo } = t.object(
      t.property("foo", t.string())
    ).assert(_arg);
    return _returnType.assert(foo);
  };

`;