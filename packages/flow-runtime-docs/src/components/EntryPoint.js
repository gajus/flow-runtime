/* @flow */
import React from 'react';

import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import App from './App';

import HomePage from './HomePage';
import TryPage from './TryPage';
import DocsPage from './DocsPage';
import PackageListPage from './PackageListPage';
import BabelPluginFlowRuntimePage from './packages/BabelPluginFlowRuntimePage';
import FlowRuntimePage from './packages/FlowRuntimePage';
import FlowConfigParserPage from './packages/FlowConfigParserPage';
import FlowRuntimeMobxPage from './packages/FlowRuntimeMobxPage';
import FlowRuntimeValidatorsPage from './packages/FlowRuntimeValidatorsPage';

import GettingStartedPage from './docs/GettingStartedPage';
import ObjectTypesPage from './docs/ObjectTypesPage';
import PrimitiveTypesPage from './docs/PrimitiveTypesPage';
import TypeAliasesPage from './docs/TypeAliasesPage';
import ArraysAndTuplesPage from './docs/ArraysAndTuplesPage';
import FunctionsPage from './docs/FunctionsPage';
import TypeContextPage from './docs/TypeContextPage';
import TypeInferencePage from './docs/TypeInferencePage';
import UnionsAndIntersectionsPage from './docs/UnionsAndIntersectionsPage';
import ExoticTypesPage from './docs/ExoticTypesPage';
import ValidationPage from './docs/ValidationPage';
import PatternMatchingPage from './docs/PatternMatchingPage';
import TypeRefinementsPage from './docs/TypeRefinementsPage';

export default function EntryPoint () {
  return (
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={HomePage} />
        <Route path="docs" component={DocsPage}>
          <IndexRoute component={GettingStartedPage} />
          <Route path="primitive-types" component={PrimitiveTypesPage} />
          <Route path="object-types" component={ObjectTypesPage} />
          <Route path="arrays-and-tuples" component={ArraysAndTuplesPage} />
          <Route path="type-aliases" component={TypeAliasesPage} />
          <Route path="type-context" component={TypeContextPage} />
          <Route path="functions" component={FunctionsPage} />
          <Route path="unions-and-intersections" component={UnionsAndIntersectionsPage} />
          <Route path="type-inference" component={TypeInferencePage} />
          <Route path="exotic-types" component={ExoticTypesPage} />
          <Route path="validation" component={ValidationPage} />
          <Route path="pattern-matching" component={PatternMatchingPage} />
          <Route path="type-refinements" component={TypeRefinementsPage} />
        </Route>
        <Route path="try" component={TryPage} />
        <Route path="packages" component={PackageListPage} />
        <Route path="flow-config-parser" component={FlowConfigParserPage} />
        <Route path="flow-runtime" component={FlowRuntimePage} />
        <Route path="flow-runtime-validators" component={FlowRuntimeValidatorsPage} />
        <Route path="flow-runtime-mobx" component={FlowRuntimeMobxPage} />
        <Route path="babel-plugin-flow-runtime" component={BabelPluginFlowRuntimePage} />
      </Route>
    </Router>
  );
}