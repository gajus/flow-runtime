const {strictEqual, ok} = require('assert');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

describe('webpack integration', () => {
  it('compiles a .js.flow import through the loader', function (done) {
    this.timeout(30000);

    // The fixture must live inside this package so webpack can resolve the
    // generated `flow-runtime` import through this package's node_modules.
    const tmp = fs.mkdtempSync(path.join(__dirname, 'fixture-build-'));
    fs.writeFileSync(
      path.join(tmp, 'types.js.flow'),
      'declare export type User = {\n  id: number\n};\n'
    );
    fs.writeFileSync(
      path.join(tmp, 'entry.js'),
      'import {User} from "./types.js.flow";\nexport {User};\n'
    );

    webpack({
      mode: 'development',
      context: tmp,
      entry: './entry.js',
      output: {
        path: path.join(tmp, 'out'),
        filename: 'bundle.js',
        libraryTarget: 'commonjs2'
      },
      module: {
        rules: [
          {
            test: /\.js\.flow$/,
            use: path.resolve(__dirname, '../lib/index.js')
          }
        ]
      }
    }, (err, stats) => {
      if (err) return done(err);
      if (stats.hasErrors()) {
        return done(new Error(stats.toString({errors: true})));
      }

      try {
        const bundlePath = path.join(tmp, 'out', 'bundle.js');
        ok(fs.existsSync(bundlePath), 'expected bundle output');

        const module = {exports: {}};
        const run = new Function('module', 'exports', 'require', fs.readFileSync(bundlePath, 'utf8'));
        run(module, module.exports, require);

        const User = module.exports.User;
        strictEqual(typeof User.assert, 'function');
        strictEqual(User.assert({id: 42}).id, 42);

        let threw = false;
        try {
          User.assert({id: 'nope'});
        } catch (error) {
          threw = true;
        }
        strictEqual(threw, true);

        fs.rmSync ? fs.rmSync(tmp, {recursive: true, force: true}) : null;
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
