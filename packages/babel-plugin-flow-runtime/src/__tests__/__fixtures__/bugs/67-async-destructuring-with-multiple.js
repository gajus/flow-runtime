/* @flow */

export const input = `
type Person = {
  name: string
};

let sayHello = async (a, { name } : Person, {name: nom}: Person = {name: 'bob'}, extra = nom) => {
  sayHello(name);
}

sayHello({ name: "Kermit" });
`;

export const expected = `
import t from "flow-runtime";
const Person = t.type("Person", t.object(
  t.property("name", t.string())
));

let sayHello = async (a, _arg, _arg2, extra) => {
  let { name } = Person.assert(_arg);
  if (_arg2 === undefined) {
    _arg2 = { name: 'bob' };
  }
  let { name: nom } = Person.assert(_arg2);
  if (extra === undefined) {
    extra = nom;
  }
  sayHello(name);
};

sayHello({ name: "Kermit" });
`;
