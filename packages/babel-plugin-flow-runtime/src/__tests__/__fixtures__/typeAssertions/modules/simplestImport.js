/* @flow */

export const input = `
  import type {Demo} from './simplestExport';
`;

export const expected = `
  import {
    Demo
  } from './simplestExport';
  import t from "flow-runtime";
`;