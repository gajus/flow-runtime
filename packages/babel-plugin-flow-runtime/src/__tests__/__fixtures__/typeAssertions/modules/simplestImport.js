/* @flow */

export const input = `
  import type {Demo} from './simplestExport';
`;

export const expected = `
  import t from "flow-runtime";

  import {
    Demo
  } from './simplestExport';
`;