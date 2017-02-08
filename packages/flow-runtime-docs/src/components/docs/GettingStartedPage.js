/* @flow */

import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';
import InstallInstruction from '../InstallInstruction';

const babelConfig = `
{
  "presets": ["stage-2", "react"],
  "plugins": [["flow-runtime"], "transform-decorators-legacy"]
}
`.trim();

@observer
export default class GettingStartedPage extends Component {

  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <h1>Getting Started</h1>
        </header>
        <div className="container">

          <h4>Installation</h4>
          <InstallInstruction packageNames={['flow-runtime']}
                              devPackageNames={[
                                'babel-plugin-flow-runtime',
                                'babel-preset-stage-2',
                                'babel-preset-react',
                                'babel-plugin-transform-decorators-legacy'
                              ]}
          />
          <p className="text-muted">Note: <code>babel-plugin-flow-runtime</code> is not required, but is recommended if you're already using Babel.</p>
          <br /><hr /><br />
          <h4>Configure the babel plugin</h4>
          <p>Add the following to your babel configuration or <code>.babelrc</code> file:</p>
          <pre>{babelConfig}</pre>
          <p>This will include the plugin with the default configuration, see the <Link to="/babel-plugin-flow-runtime">babel-plugin-flow-runtime</Link> page for more information about the plugin options.</p>
        </div>
      </div>
    );
  }
}

