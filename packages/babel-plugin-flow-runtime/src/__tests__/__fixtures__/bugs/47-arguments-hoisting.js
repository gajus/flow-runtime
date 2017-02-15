/* @flow */

export const input = `
type Person = {
  name: string
};

let sayHello = ({ name } : Person) => {
  sayHello(name);
}

sayHello({ name: "Kermit" });
`;

export const expected = `
import t from "flow-runtime";
const Person = t.type("Person", t.object(
  t.property("name", t.string())
));

let sayHello = function ({ name }) {
  t.param("arguments[0]", Person).assert(arguments[0]);
  sayHello(name);
};

sayHello({ name: "Kermit" });
`;
