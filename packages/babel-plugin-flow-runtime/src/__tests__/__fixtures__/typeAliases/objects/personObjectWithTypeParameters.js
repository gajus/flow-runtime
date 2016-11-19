/* @flow */

export const input = `
  type Person<A: string> = {
    name: string;
    surname: A;
  };
`;

export const expected = `
  import t from "flow-runtime";
  const Person = t.type("Person", Person => {
    const A = Person.typeParameter("A", t.string());
    return t.object(
      t.property("name", t.string()),
      t.property("surname", A)
    );
  });
`;
