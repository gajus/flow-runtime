/* @flow */
import React, { Component } from 'react';
import {observer} from 'mobx-react';

import InstallInstruction from '../InstallInstruction';
import Example from '../Example';

// eslint-disable-next-line
const simpleExample = `
import parse from 'flow-config-parser';

const exampleConfig = \`
[ignore]

.*/node_modules/.*/src.*
.*/test/.*json$

[include]
flow-typed
flow-typed/npm

[libs]

[options]
module.system=node
munge_underscores=true
module.name_mapper='.*\(.css\)' -> 'empty/object'
module.name_mapper='.*\(.scss\)' -> 'empty/object'
module.name_mapper='.*\(.png\)' -> 'empty/object'
module.name_mapper='.*worker-loader.*' -> 'empty/object'

suppress_type=$FlowIgnore

suppress_comment=\\\\(.\\\\|\\\\n\\\\)*\\\@flowIgnore.*

esproposal.class_instance_fields=enable
esproposal.class_static_fields=enable
esproposal.decorators=ignore
unsafe.enable_getters_and_setters=true

[version]
0.36.0
\`;

const config = parse(exampleConfig);
console.log('munge_underscores', config.get('munge_underscores'));
console.log('should suppress $flowIgnore?', config.suppressesType('$flowIgnore'));
console.log('should suppress Boolean?' , config.suppressesType('Boolean'));
console.log('should ignore node_modules/react/react.js?', config.ignoresFile('node_modules/react/react.js'));
console.log('remap foo.scss', config.remapModule('foo.scss'));
console.log(JSON.stringify(config, null, 2));

`.trim();

@observer
export default class FlowConfigParserPage extends Component {
  render() {
    return (
      <div>
        <header className="jumbotron jumbotron-fluid text-xs-center">
          <div className="container">
            <h1>flow-config-parser</h1>
              <p className="lead">
                Parses <code>.flowconfig</code> files and provides an API for inspecting the configuration.
            </p>
            <a href="https://github.com/codemix/flow-runtime/tree/master/packages/flow-config-parser" className="btn btn-primary">
              <i className="fab fa-github" />
              {' '}
              flow-config-parser on github
            </a>
          </div>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-sm-10 offset-sm-1">
              <h4>Installation</h4>
              <InstallInstruction packageNames={['flow-config-parser']} />
              <hr />
              <h4>Usage</h4>
              <Example code={simpleExample} inline hideOutput inputTitle={<p>Pass the contents of <code>.flowconfig</code> to <code>parse()</code>:</p>}/>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

