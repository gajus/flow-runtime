/* @flow */

export const input = `
  import { Component as C } from "react";

  type Props = {
    x: number;
    y: number;
  };

  class Point extends C<Props, void> {
    render() {
      return <div>{this.props.x} : {this.props.y}</div>;
    }
  }
`;

export const expected = `
  import { Component as C } from "react";
  import t from "flow-runtime";

  const Props = t.type("Props", t.object(
    t.property("x", t.number()),
    t.property("y", t.number())
  ));

  class Point extends C {
    static propTypes = t.propTypes(Props);

    constructor(...args) {
      super(...args);
      t.bindTypeParameters(this, Props, t.void());
    }

    render() {
      return <div>{this.props.x} : {this.props.y}</div>;
    }
  }
`;