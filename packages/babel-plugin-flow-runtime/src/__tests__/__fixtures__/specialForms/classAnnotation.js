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
    let _modelType = t.ref("Class", t.ref(User));
    t.param("model", _modelType).assert(model);
  }
`;

export const decorated = `
  import t from "flow-runtime";
  @t.decorate(t.class("User"))
  class User {}

  function demo(model) {}

  t.annotate(
    demo,
    t.function(
      t.param("model", t.ref("Class", t.ref(User)))
    )
  );
`;

export const combined = `
  import t from "flow-runtime";
  @t.decorate(t.class("User"))
  class User {}

  function demo(model) {
    let _modelType = t.ref("Class", t.ref(User));
    t.param("model", _modelType).assert(model);
  }

  t.annotate(
    demo,
    t.function(
      t.param("model", t.ref("Class", t.ref(User)))
    )
  );
`;