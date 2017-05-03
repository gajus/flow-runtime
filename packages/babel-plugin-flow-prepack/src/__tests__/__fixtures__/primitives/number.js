/* @flow */

export const input = `
  type Demo = number;

  declare var demo: Demo;
`;

export const expected = `
  const Demo = "number";

  __assumeDataProperty(global, "demo", __abstract(Demo));
`;