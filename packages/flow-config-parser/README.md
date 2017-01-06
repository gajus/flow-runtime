# Flow Config Parser

Parses `.flowconfig` files and provides an API for inspecting the configuration.

```js
import fs from 'fs'
import parse from 'flow-config-parser';
const config = parse(fs.readFileSync('.flowconfig', 'utf8'));

console.log(config.get('munge_underscores')); // true
console.log(config.suppressesType('$flowIgnore')); // true
console.log(config.suppressesType('Boolean')); // false
console.log(config.ignoresFile('node_modules/react/react.js')); // true | false
console.log(config.remapModule('foo.scss')); // 'object-shim.js'
```
