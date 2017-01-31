/* @flow */

export const input = `
  import type {Demo} from './simplestExport';
`;

export const expected = `
  import { Demo as _Demo } from './simplestExport';
  import t from "flow-runtime";
  const Demo = t.tdz(() => _Demo);
`;