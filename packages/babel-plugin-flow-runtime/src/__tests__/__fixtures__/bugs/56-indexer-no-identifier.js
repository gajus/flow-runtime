/* @flow */

export const input = `
type Animal = {};

type AnimalID = string;

type AnimalMap = {
  [AnimalID]: Animal;
};
`;

export const expected = `
import t from "flow-runtime";

const Animal = t.type("Animal", t.object());
const AnimalID = t.type("AnimalID", t.string());

const AnimalMap = t.type("AnimalMap", t.object(
  t.indexer("key", AnimalID, Animal)
));
`;