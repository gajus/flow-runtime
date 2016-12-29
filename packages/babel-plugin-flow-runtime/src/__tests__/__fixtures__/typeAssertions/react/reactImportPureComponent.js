/* @flow */

export const input = `
  import { PureComponent } from "react";

  type Props = {
    x: number;
    y: number;
  };

  class Point extends PureComponent<void, Props, void> {
    render() {
      return <div>{this.props.x} : {this.props.y}</div>;
    }
  }
`;

export const expected = `
  import t from "flow-runtime";
  import { PureComponent } from "react";

  const Props = t.type("Props", t.object(
    t.property("x", t.number()),
    t.property("y", t.number())
  ));

  class Point extends PureComponent {
    static propTypes = t.propTypes(Props);

    constructor(...args) {
      super(...args);
      t.bindTypeParameters(this, t.void(), Props, t.void());
    }

    render() {
      return <div>{this.props.x} : {this.props.y}</div>;
    }
  }
`;