/* @flow */

export const input = `
import * as R from 'react';

type Props = {
  x: number;
  y: number;
};

class Point extends R.Component {
  props: Props;
  render() {
    return <div>{this.props.x} : {this.props.y}</div>;
  }
}
`;

export const expected = `
import * as R from 'react';
import t from "flow-runtime";

const Props = t.type("Props", t.object(
  t.property("x", t.number()),
  t.property("y", t.number())
));

class Point extends R.Component {
  static propTypes = t.propTypes(Props);
  @t.decorate(Props) props;
  render() {
    return <div>{this.props.x} : {this.props.y}</div>;
  }
}
`;