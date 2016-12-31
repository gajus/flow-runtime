/* @flow */

export const input = `
  type Tree<T> = {
    value: T;
    left?: Tree<T>;
    right?: Tree<T>;
  };
`;

export const expected = `
  import t from "flow-runtime";

  const Tree = t.type("Tree", Tree => {
    const T = Tree.typeParameter("T");

    return t.object(
      t.property("value", T),
      t.property("left", t.ref(Tree, T), true),
      t.property("right", t.ref(Tree, T), true)
    );
  });
`;