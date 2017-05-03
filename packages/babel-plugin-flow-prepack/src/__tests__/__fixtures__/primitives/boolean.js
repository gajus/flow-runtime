/* @flow */

export const input = `
  type Demo = boolean;

  declare var demo: Demo;
`;

export const expected = `
  const Demo = "boolean";

  __assumeDataProperty(global, "demo", __abstract(Demo));
`;