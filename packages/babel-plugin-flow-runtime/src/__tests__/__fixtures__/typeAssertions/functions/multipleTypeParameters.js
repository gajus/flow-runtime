/* @flow */

export const input = `
  const demo = <K, V> (key: K, value: V): Map<K, V> => new Map([[key, value]]);
`;

export const expected = `
  import t from "flow-runtime";
  const demo = (key, value) => {
    const K = t.typeParameter("K");
    const V = t.typeParameter("V");
    let _keyType = t.flowInto(K);
    let _valueType = t.flowInto(V);
    const _returnType = t.return(t.ref("Map", K, V));
    t.param("key", _keyType).assert(key);
    t.param("value", _valueType).assert(value);
    return _returnType.assert(new Map([[key, value]]));
  };

`;