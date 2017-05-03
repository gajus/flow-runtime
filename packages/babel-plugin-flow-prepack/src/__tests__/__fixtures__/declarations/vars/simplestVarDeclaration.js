/* @flow */

export const input = `
  declare var id: number;
`;

export const expected = `
  __assumeDataProperty(global, "id", __abstract("number"));
`;