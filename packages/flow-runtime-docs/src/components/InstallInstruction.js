/* @flow */

import React, { Component } from 'react';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';

type Props = {
  devPackageNames?: string[];
  packageNames?: string[];
};

@observer
export default class InstallInstruction extends Component<Props, void> {
  @observable showYarn: boolean = false;

  @computed get installCode (): string {
    const {devPackageNames, packageNames} = this.props;
    const output = [];
    if (this.showYarn) {
      if (packageNames) {
        output.push(...packageNames.map(name => `yarn add ${name}`));
      }
      if (devPackageNames) {
        output.push(...devPackageNames.map(name => `yarn add --dev ${name}`));
      }
    }
    else {
      if (packageNames) {
        output.push(...packageNames.map(name => `npm install ${name}`));
      }
      if (devPackageNames) {
        output.push(...devPackageNames.map(name => `npm install --dev ${name}`));
      }
    }
    return output.join('\n');
  }

  handleClickNpm = (e: SyntheticMouseEvent) => {
    e.preventDefault();
    this.showYarn = false;
  };


  handleClickYarn = (e: SyntheticMouseEvent) => {
    e.preventDefault();
    this.showYarn = true;
  };

  render() {
    return (
      <div>
        <p className="lead">
          Install with
          {' '}
          {this.showYarn ? <a href="#" onClick={this.handleClickNpm}>npm</a> : 'npm'}
          {' or '}
          {this.showYarn ? 'yarn' : <a href="#" onClick={this.handleClickYarn}>yarn</a>}.</p>
        <pre>{this.installCode}</pre>
      </div>
    );
  }
}

