/* @flow */
import './typedefs';

import minimist from 'minimist';
import type {minimistOutput} from 'minimist';

import * as generate from './commands/GenerateCommand';
import * as listDefinitions from './commands/ListDefinitionsCommand';
import * as listTypes from './commands/ListTypesCommand';

export type Argv = minimistOutput;

const commands = {
  [generate.name]: generate,
  [listDefinitions.name]: listDefinitions,
  [listTypes.name]: listTypes
};

export type Command = {
  name: string;
  description: string;
  help?: (argv: Argv) => string;
  run (argv: Argv): any;
};

export default async function run (args: string[]) {
  const argv: Argv = minimist(args);
  const command = argv._.length === 0
                ? undefined
                : commands[argv._[0]]
                ;

  if (argv.help || !command) {
    showUsage(argv);
    return;
  }
  try {
    const result = command.run(argv);
    if (result && typeof result.then === 'function') {
      await result;
    }
  }
  catch (e) {
    console.error(e.stack);
  }
}


function showUsage (argv: Argv) {
  console.error(`Usage: flow-runtime [OPTIONS]`);
  for (const key in commands) {
    const command = commands[key];
    console.error(`\t${command.name}:\t${command.description}`);
  }
}
