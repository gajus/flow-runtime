/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';
import logo from '../../assets/logo.png';
import {Link} from 'react-router';

import Example from './Example';

import PackageList from './PackageList';

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
            <Link className="btn btn-primary" to="/docs">Get Started</Link>
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
              <PackageList />
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
                Because not only does this help us catch errors earlier in development, type information can be incredibly useful for lots of things:
              </p>
              <ul>
                <li>Validating user input</li>
                <li>Safe and efficient (de-)serialization</li>
                <li>Checking React prop types</li>
                <li>API Documentation</li>
                <li>Hashing complex values</li>
                <li>Generating user interfaces</li>
                <li>Conversion to other representations, e.g. JSON-Schema.</li>
              </ul>
              <p>
                There are other validation and typing libraries for JavaScript, but this one aims for full compatibility with Flow, and therefore is capable of representing any kind of JavaScript value. This is not possible with many of the alternatives, which do a great job with validation, but can't represent e.g. a function. It aims to provide a base upon which more interesting projects can be built.
              </p>
              <hr />
              <h4>Why do I want this if I already use Flow?</h4>
              <p>
                We're big advocates for using <a href="https://flowtype.org/" target="_blank">Flow</a> for statically checking JavaScript, it's a fantastic tool and we use it everywhere we can. By design, Flow runs at <em>compile time</em>, and so it can only verify code and data that it can actually see and understand.</p>
              <p>
                Every time control passes to untyped code (via a call to a library function, for example), Flow has to bail out, and assign the type <code>any</code> to the value, which means that any subsequent checks against this value will silently pass, even if it's completely wrong - it's unsound.
                When first introducing Flow to an existing codebase this unsoundness can be everywhere. Even if you explicitly annotate the result of every call into untyped code, there's no way for Flow to validate that your assumption is correct.
              </p>
              <p>
                When combined with <Link to="/babel-plugin-flow-runtime">a babel plugin</Link>, <code>flow-runtime</code> can fill in this gap. The babel plugin takes the Flow annotations you're writing anyway, and compiles them into <code>flow-runtime</code> calls and declarations. Now every annotation will be checked at runtime, which is especially useful during development. It does incur a performance hit though, so it's often sensible to turn off <code>assertion</code> mode in production, leaving type declarations intact but eliminating the associated overhead.
              </p>
              <Link to="/try">You can try out the babel plugin in your browser</Link>
              <hr />
              <h4>What about TypeScript?</h4>
              <p>Despite the name, it's absolutely possible to use <code>flow-runtime</code> with TypeScript. Unfortunately it's not yet possible to leverage the TypeScript annotations themselves, but all of the library methods should match the relevant TypeScript semantics as Flow and TypeScript are both "just JavaScript".</p>
              <hr />
              <h4>Is this project affiliated with Facebook?</h4>
              <p>No. This project comes from <a href="http://codemix.com/">codemix</a>, a web development company that you should hire for your next project.</p>
              <p>It builds on our previous work with <a href="https://github.com/codemix/babel-plugin-typecheck" target="_blank">babel-plugin-typecheck</a>, but shares a lot of ideas with the work of Giulio Canti and others on <a href="https://github.com/gcanti/tcomb" target="_blank">tcomb</a> and <a href="https://github.com/gcanti/flow-io" target="_blank">flow-io</a>.</p>
              <hr />
              <h4>How do I get started?</h4>
              <p>Go to the <Link to="/docs">Getting Started</Link> page, or install with:</p>
              <pre>{`npm install --save flow-runtime\nnpm install --save-dev babel-plugin-flow-runtime`}</pre>
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

