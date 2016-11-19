/* @flow */

type FlowConfigSectionName
  = 'ignore'
  | 'include'
  | 'lib'
  | 'options'
  | 'version'
  ;

const KNOWN_REGEXPS = {
  ignore: true,
  options: {
    'suppress_comment': true,
    'module.name_mapper': true
  }
};

const KNOWN_BOOLEANS = {
  options: {
    'munge_underscores': true,
    'use_strict': true,
    'strip_root': true,
  }
};

const KNOWN_NUMERICS = {
  options: {
    'server.max_workers': true,
    'traces': true
  }
};

/**
 * Parse a given flow configuration (supplied as a string), and return the parsed representation.
 */
export default function parseFlowConfig (input: string, projectRoot: string = process.cwd()): Object {
  const lines = input.split(/(\r?\n)+/).map(line => line.trim()).filter(line => line.length > 0);

  const structure = new FlowConfig();

  let section;
  let sectionName: FlowConfigSectionName;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.charAt(0) === '#' || line.charAt(0) === ';') {
      // This is a comment.
      continue;
    }
    const matchSection = /^\[(.+)\](\s*#(.*))?$/.exec(line);
    if (matchSection) {
      sectionName = matchSection[1].trim();
      section = [];
      (structure: any)[sectionName] = section;
    }
    else if (!section || !sectionName) {
      throw new Error('Invalid flow configuration, found entry outside of a named section.');
    }
    else if (KNOWN_REGEXPS[sectionName] === true) {
      section.push(regexpify(line));
    }
    else {
      const matchesKeyValue = /^([A-Za-z0-9_\.]+)=(.*)$/.exec(line);
      if (matchesKeyValue) {
        const key = matchesKeyValue[1];
        let value = matchesKeyValue[2];
        if (KNOWN_REGEXPS[sectionName] && KNOWN_REGEXPS[sectionName][key]) {
          const matchesMapper = /^\s*'(.*)'\s*->\s*'(.*)'$/.exec(value);
          if (matchesMapper) {
            value = [regexpify(matchesMapper[1]), matchesMapper[2]];
          }
          else {
            value = regexpify(value);
          }
        }
        else if (KNOWN_BOOLEANS[sectionName] && KNOWN_BOOLEANS[sectionName][key]) {
          value = value === 'true' ? true : false;
        }
        else if (KNOWN_NUMERICS[sectionName] && KNOWN_NUMERICS[sectionName][key]) {
          value = Number(value);
        }
        else {
          const matchesMapper = /^\s*'(.*)'\s*->\s*'(.*)'$/.exec(value);
          if (matchesMapper) {
            value = [matchesMapper[1], matchesMapper[2].replace(/<PROJECT_ROOT>/g, projectRoot)];
          }
        }
        section.push([key, value]);
      }
      else {
        section.push(line);
      }
    }
  }

  return structure;
}


function regexpify (input: string, projectRoot: string = process.cwd()): RegExp {
  return new RegExp(
    input
    .replace(/\\([\(\|\)])/g, (a, b) => b)
    .replace(/<PROJECT_ROOT>/g, projectRoot)
    .replace(/\//g, '\\/'));
}


export class FlowConfig {
  ignore: any[] = [];
  include: any[] = [];
  lib: any[] = [];
  options: any[] = [];
  version: any[] = [];

  ignoresFile (filename: string): boolean {
    const {ignore} = this;
    const {length} = ignore;
    for (let i = 0; i < length; i++) {
      const pattern = ignore[i];
      if (pattern.test(filename)) {
        return true;
      }
    }
    return false;
  }

  suppressesType (name: string): boolean {
    const {options} = this;
    const {length} = options;
    for (let i = 0; i < length; i++) {
      const [key, value] = options[i];
      if (key === 'suppress_type' && name === value) {
        return true;
      }
    }
    return false;
  }

  suppressesComment (comment: string): boolean {
    const {options} = this;
    const {length} = options;
    for (let i = 0; i < length; i++) {
      const [key, value] = options[i];
      if (key === 'suppress_comment' && value.test(comment)) {
        return true;
      }
    }
    return false;
  }

  remapModule (name: string): string {
    const mappers = this.get('module.name_mapper');
    for (const [pattern, redirect] of mappers) {
      if (pattern.test(name)) {
        return redirect;
      }
    }
    return name;
  }

  get (target: string): any {
    const named = (this: any)[target];
    if (named !== null && typeof named === 'object') {
      return named;
    }
    const {options} = this;
    const {length} = options;
    let result = [];
    for (let i = 0; i < length; i++) {
      const [key, value] = options[i];
      if (key === target) {
        if (KNOWN_BOOLEANS.options[key] || KNOWN_NUMERICS.options[key]) {
          return value;
        }
        result.push(value);
      }
    }
    return result;
  }
}