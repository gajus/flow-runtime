/* @flow */

export const input = `
  import { type Demo } from './simplestExportType';

  type Local = number;

  type Item = {
    local: Local;
    value: Demo;
  };
`;

export const expected = `
  import { Demo as _Demo } from './simplestExportType';
  import t from "flow-runtime";
  const Demo = t.tdz(() => _Demo);

  const Local = t.type("Local", t.number());

  const Item = t.type("Item", t.object(
    t.property("local", Local),
    t.property("value", t.ref(Demo))
  ));
`;

export const customRuntime = `
  import { Demo as _Demo } from './simplestExportType';
  import t from "./custom-flow-runtime";
  const Demo = t.tdz(() => _Demo);

  const Local = t.type("Local", t.number());

  const Item = t.type("Item", t.object(
    t.property("local", Local),
    t.property("value", t.ref(Demo))
  ));
`;
