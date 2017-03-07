/* @flow */

export const input = `
type Person = {
  name: string
};

let sayHello = async ({ name } : Person) => {
  sayHello(name);
}

sayHello({ name: "Kermit" });
`;

export const expected = `
import t from "flow-runtime";
const Person = t.type("Person", t.object(
  t.property("name", t.string())
));

let sayHello = async _arg => {
  let { name } = Person.assert(_arg);
  sayHello(name);
};

sayHello({ name: "Kermit" });
`;
