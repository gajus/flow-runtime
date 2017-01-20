/* @flow */

export const input = `
/* @flow */

class Demo {
  'test': boolean;
}

`;

export const expected = `
import t from "flow-runtime";
/* @flow */

class Demo {
  @t.decorate(t.boolean())
  'test';
}

`;


export const annotated = `
import t from "flow-runtime";
/* @flow */

@t.annotate(t.class("Demo", t.property("test", t.boolean())))
class Demo {
  'test';
}

`;