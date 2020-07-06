/* @flow */
import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Link, IndexLink} from 'react-router';
import logo from './assets/logo.png';


@observer
export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-inverse">
        <div className="container">
          <IndexLink className="navbar-brand" to="/">
            <img src={logo} style={{height: 30, marginTop: -6}} alt="flow-runtime"/>
            {' '}
            flow-runtime
          </IndexLink>
          <nav className="nav navbar-nav">
              <Link className="nav-item nav-link" activeClassName="active" to="/try">Try</Link>
              <Link className="nav-item nav-link" activeClassName="active" to="/packages">Packages</Link>
              <Link className="nav-item nav-link" activeClassName="active" to="/docs">Docs</Link>
          </nav>
          <ul className="nav navbar-nav float-sm-right hidden-xs-down">
            <li className="nav-item">
              <a href="https://github.com/codemix/flow-runtime" className="nav-link">
                <i className="fab fa-github" />
                {' '}
                <span className="hidden-sm-down">flow-runtime on</span>
                {' '}
                <span>github</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
