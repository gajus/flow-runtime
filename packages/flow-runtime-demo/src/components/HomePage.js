/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';
import logo from '../../assets/logo.png';
import {Link} from 'react-router';

import Example from './Example';

const exampleCode = `
type Person = {
  name: string;
};

function greet (person: Person): string {
  return 'Hello ' + person.name;
}

console.log(greet({name: 'Alice'}));
console.log(greet({name: false}));
`.trim();

@observer
export default class HomePage extends Component {
  render() {
    return (
      <div className="HomePage">
        <div className="jumbotron text-xs-center bg-inverse text-white">
          <div className="container">
            <h1>
              <img src={logo} className="App-logo" alt="logo" />
              {' '}
              flow-runtime
            </h1>
            <p className="lead">
              Flow-compatible runtime type system for JavaScript.
            </p>
          </div>
        </div>
        <div className="container">
          <div className="card-group">
            <div className="card">
              <div className="card-block">
                <h4 className="card-title">Complete Type System</h4>
                <p className="card-text">Can express and validate the type of any possible JavaScript value, with support for type inference, reflection, bounded polymorphism and generics. Produces beautiful error messages.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-block">
                <h4 className="card-title">Designed for Flow</h4>
                <p className="card-text">Complementing, not competing with Flow, <code>flow-runtime</code> matches Flow's semantics and they're designed to be used together. Supports flow type annotations using an optional babel plugin.</p>
              </div>
            </div>
            <div className="card">
              <div className="card-block">
                <h4 className="card-title">Safe. DRY. Fun.</h4>
                <p className="card-text">Adds type safety to your code at development-time. Saves on repitition by turning types into values. Makes dealing with things like form validation and React prop types easy and fun.</p>
              </div>
            </div>
          </div>
          <br /><br />
          <div className="row">
            <div className="col-sm-10 offset-sm-1">
              <h1 className="text-xs-center">What?</h1>
              <br />
              <p className="lead">This project is a collection of packages which make it easy to work with types in JavaScript:</p>
              <div className="list-group">
                <Link to="/flow-runtime" className="list-group-item list-group-item-action">
                  <h5 className="list-group-item-heading">
                    flow-runtime
                  </h5>
                  <p className="list-group-item-text">The core runtime library, responsible for representing types, validation, error messages etc.</p>
                </Link>
                <Link to="/babel-plugin-flow-runtime" className="list-group-item list-group-item-action">
                  <h5 className="list-group-item-heading">
                    babel-plugin-flow-runtime
                  </h5>
                  <p className="list-group-item-text">
                    A babel plugin which transforms static type annotations into <samp>flow-runtime</samp> type declarations.
                  </p>
                </Link>
                <Link to="/flow-config-parser" className="list-group-item list-group-item-action">
                  <h5 className="list-group-item-heading">
                    flow-config-parser
                  </h5>
                  <p className="list-group-item-text">
                    Parses <samp>.flowconfig</samp> files and makes them available to JavaScript.
                  </p>
                </Link>
              </div>
              <br />
              <Example
                code={exampleCode}
                inline
                inputTitle={(
                  <p className="lead">When combined, they let you write code like this:</p>
                )}
                outputTitle={(
                  <p className="lead">Which compiles into code like this:</p>
                )}
              />
              <br /><br />
              <h1 className="text-xs-center">Why?</h1>
              <p className="lead">
                Because type information can be incredibly useful.
              </p>
              <h1 className="text-xs-center">How?</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

