const autoprefixer = require('autoprefixer');
const env = process.env.NODE_ENV;
const path = require( 'path' );
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

module.exports = {
  mode: 'development',

  entry: [
    require.resolve('./src/polyfills'),
    './src/index.js'
  ],

  output: {
    path: path.resolve( __dirname, 'build' ),
    filename: 'static/js/[name].[chunkhash:8].js',
    pathinfo: process.env.NODE_ENV === 'development',
  },

  resolve: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules"
    ],
  },

  module: {
    rules: [
      {
        exclude: [
          /\.(eot|ttf|woff|woff2)$/,
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/,
        ],
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(js|jsx)$/,
        include: /src/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            // We use PostCSS for autoprefixing only.
            options: {
              plugins: function() {
                return [ autoprefixer() ];
              }
            },
          }
        ]
      },

      // Web workers.
      {
        test: /\.worker\.(js|jsx)$/,
        include: /src/,
        exclude: /node_modules/,
        use: [
          { loader: 'worker-loader' },
          { loader: 'babel-loader'}
        ],
      },
      // "file" loader for fonts and svg
      {
        include: [
          /\.(eot|ttf|woff|woff2)$/,
          /\.svg$/,
        ],
        loader: 'file-loader',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin( {
      // need to be placed in root, because references other media items like fonts
      filename: '[name].css',
    } ),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin('node_modules'),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    })
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
