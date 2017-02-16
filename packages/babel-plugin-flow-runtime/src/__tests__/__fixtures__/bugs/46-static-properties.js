/* @flow */

export const input = `

declare class Error {
    static (message?:string):Error;
    message: string;
    static captureStackTrace?: (target: Object, constructor?: Function) => void;
}
`;

export const expected = `
import t from "flow-runtime";
t.declare(t.class(
  "Error",
  t.object(
    t.staticCallProperty(t.function(
      t.param("message", t.string(), true),
      t.return(t.ref("Error"))
    )),
    t.property("message", t.string()),
    t.staticProperty("captureStackTrace", t.function(
      t.param("target", t.object()),
      t.param("constructor", t.function(), true),
      t.return(t.void())
    ), true)
  )
));
`;
