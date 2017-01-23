/* @flow */

export const input = `
  class User {}

  function demo (model: Class<User>) {

  }
`;


export const expected = `
  import t from "flow-runtime";
  class User {}

  function demo(model) {
    let _modelType = t.Class(t.ref(User));
    t.param("model", _modelType).assert(model);
  }
`;

export const annotated = `
  import t from "flow-runtime";
  @t.annotate(t.class("User"))
  class User {}

  function demo(model) {}

  t.annotate(
    demo,
    t.function(
      t.param("model", t.Class(t.ref(User)))
    )
  );
`;

export const combined = `
  import t from "flow-runtime";
  @t.annotate(t.class("User"))
  class User {}

  function demo(model) {
    let _modelType = t.Class(t.ref(User));
    t.param("model", _modelType).assert(model);
  }

  t.annotate(
    demo,
    t.function(
      t.param("model", t.Class(t.ref(User)))
    )
  );
`;