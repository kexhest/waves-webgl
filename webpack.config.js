/* eslint-disable strict, global-require, max-len */

'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const production = process.env.NODE_ENV === 'production';
const dev = !production;

const config = {
  debug: dev,
  devtool: dev ? 'cheap-module-eval-source-map' : undefined,

  resolve: {
    root: [
      path.resolve(__dirname, 'app', 'scripts'),
      path.resolve(__dirname, 'app', 'styles'),
    ],
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx', '.json', 'scss'],
    alias: {},
  },

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /(node_modules)/,
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw',
        exclude: /(node_modules)/,
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify',
        exclude: /(node_modules)/,
      },
      {
        test: /\.(woff|woff2|svg|png|jpg|jpeg|gif|m4a|mp4|webm)$/,
        loader: 'file?hash=sha512&digest=hex&name=[name].[ext]&limit=10000',
      },
      {
        test: /\.scss$/,
        loader: dev
          ? 'style!css!postcss!sass'
          : ExtractTextPlugin.extract('style', 'css!postcss!sass'),
      },
    ],
  },

  entry: {
    app: [
      path.resolve(__dirname, 'app', 'entry.js'),
    ].concat(dev
      ? ['webpack-hot-middleware/client?reload=true']
      : []
    ),
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    filename: `${dev ? '[name]' : '[chunkhash]'}.js`,
  },

  sassLoader: {
    outputStyle: 'expanded',
    includePaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'app', 'styles'),
    ],
  },

  postcss: [
    require('autoprefixer')({browsers: ['last 2 version']})
  ].concat(dev
    ? []
    : [require('csswring')({removeAllComments: true})]
  ),

  plugins: [
    new webpack.ProvidePlugin({
      OrbitControls: 'imports?THREE=three!exports?THREE.OrbitControls!three/examples/js/controls/OrbitControls',
      FirstPersonControls: 'imports?THREE=three!exports?THREE.FirstPersonControls!three/examples/js/controls/FirstPersonControls',
      DeviceOrientationControls: 'imports?THREE=three!exports?THREE.DeviceOrientationControls!three/examples/js/controls/DeviceOrientationControls',
      VRControls: 'imports?THREE=three!exports?THREE.VRControls!three/examples/js/controls/VRControls',
      VREffect: 'imports?THREE=three!exports?THREE.VREffect!three/examples/js/effects/VREffect',
      StereoEffect: 'imports?THREE=three!exports?THREE.StereoEffect!three/examples/js/effects/StereoEffect',
      CardboardEffect: 'imports?THREE=three!exports?THREE.CardboardEffect!three/examples/js/effects/CardboardEffect',
      WEBVR: 'exports?WEBVR!three/examples/js/WebVR',
      Stats: 'exports?Stats!three/examples/js/libs/stats.min',
      'dat.GUI': 'exports?dat.GUI!three/examples/js/libs/dat.gui.min.js',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'app', 'index.template.html'),
      filename: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
      },
    }),
  ].concat(dev
    ? [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('dev'),
        },
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ]
    : [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        output: { comments: false },
        mangle: true,
        compress: {
          drop_console: true,
          dead_code: true,
          warnings: false,
        },
      }),
      new ExtractTextPlugin('[contenthash].css'),
    ]
  ),
};

module.exports = config;
