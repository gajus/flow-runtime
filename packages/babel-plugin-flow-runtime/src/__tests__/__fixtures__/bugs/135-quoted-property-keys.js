/* @flow */

export const input = `
type ODataAST = {
  '$path'?: $path,
  '$select'?: $select,
  '$expand'?: $expand,
  '$filter'?: $filter,
  '$orderby'?: $orderby,
  '$callback'?: string,
  '$format'?: string,
  '$search'?: string,
  '$count'?: boolean,
  '$skip'?: number,
  '$top'?: number
}
`;

export const expected = `
  import t from "flow-runtime";
  const ODataAST = t.type("ODataAST", t.object(
    t.property("$path", t.ref("$path"), true), 
    t.property("$select", t.ref("$select"), true), 
    t.property("$expand", t.ref("$expand"), true), 
    t.property("$filter", t.ref("$filter"), true), 
    t.property("$orderby", t.ref("$orderby"), true), 
    t.property("$callback", t.string(), true), 
    t.property("$format", t.string(), true), 
    t.property("$search", t.string(), true), 
    t.property("$count", t.boolean(), true), 
    t.property("$skip", t.number(), true), 
    t.property("$top", t.number(), true))
  );
`;