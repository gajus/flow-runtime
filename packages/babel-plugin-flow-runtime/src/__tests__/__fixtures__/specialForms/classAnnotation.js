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