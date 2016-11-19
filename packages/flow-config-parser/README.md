# Flow Config Parser

```js
var parser = require('flow-config-parser');
const config = parser.parse(fs.readFileSync('.flowconfig', 'utf8'));

console.log(config.get('munge_underscores')); // true
console.log(config.suppessesType('$flowIgnore')); // true
console.log(config.suppressesType('Boolean')); // false
console.log(config.ignoresFile('node_modules/react/react.js')); // true | false
console.log(config.remapModule('foo.scss')); // 'object-shim.js'
```