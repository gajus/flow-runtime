/* @flow */

export const input = `
  type Person<A> = {
    name: string,
    surname: A
  };

  type PersonType = Person<string>;
`;

export const expected = `
  import t from "flow-runtime";
  const Person = t.type("Person", Person => {
    const A = Person.typeParameter("A");
    return t.object(
      t.property("name", t.string()),
      t.property("surname", A)
    );
  });

  const PersonType = t.type("PersonType", t.ref(Person, t.string()));
`;