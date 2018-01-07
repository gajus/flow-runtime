#!/usr/bin/env node
/* eslint-disable strict */
'use strict';

const argv = process.argv.slice(2);

const run = require('./lib').default;

run(argv);