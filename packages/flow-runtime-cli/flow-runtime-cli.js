#!/usr/bin/env node
'use strict';

const argv = process.argv.slice(2);

const run = require('./lib').default;

run(argv);