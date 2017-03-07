/* @flow */

export const input = `
/* @flow */
/* @flow-runtime warn, annotate */

type Demo = 123;

("nope": Demo);

const demo = ([foo]: string[]): string => foo;
`;

export const expected = `
import t from "flow-runtime";
/* @flow */
/* @flow-runtime warn, annotate */

const Demo = t.type("Demo", t.number(123));

t.warn(Demo, "nope");

const demo = t.annotate(
  function demo(_arg) {
    const _returnType = t.return(t.string());
    let [foo] = t.warn(t.array(t.string()), _arg);
    return t.warn(_returnType, foo);
  },
  t.function(
    t.param("_arg", t.array(t.string())),
    t.return(t.string())
  )
);
`;