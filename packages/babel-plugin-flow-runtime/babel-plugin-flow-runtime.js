var plugin = require('./lib').default;
var transform = require('./lib/transform');

plugin.transform = transform;
module.exports = plugin;