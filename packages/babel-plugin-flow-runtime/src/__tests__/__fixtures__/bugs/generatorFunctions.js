/* @flow */

export const input = `
/* @flow */

export default function demo <G> () {
  function* gen (): G {
    yield value;
  }
}

`;

export const expected = `
import t from "flow-runtime";
/* @flow */

export default function demo() {
  const G = t.typeParameter("G");
  function* gen() {
    const _yieldType = t.mixed();
    const _returnType = t.return(t.mixed());
    yield _yieldType.assert(value);
  }
}

`;


export const annotated = `
import t from "flow-runtime";
/* @flow */

export default function demo() {
  function* gen() {
    yield value;
  }
  t.annotate(gen, t.function(t.return(G)));
}
t.annotate(demo, t.function(_fn => {
  const G = _fn.typeParameter("G");
  return [];
}));
`;