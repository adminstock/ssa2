'use strict';

var path = require('path');
var webpack = require('webpack');
var webpackNotifierPlugin = require('webpack-notifier');
var spritesmithPlugin = require('webpack-spritesmith');
var i18nPlugin = require('i18n-webpack-plugin');
var htmlWebpackPlugin = require('html-webpack-plugin');

// TODO: move to external file
var apiServers = [
  {
    // http://localhost.fiddler:62802/ - for fiddler
    'Url': 'http://localhost:62802/',
    'AuthUrl': 'http://localhost:62802/',
    'Name': 'WebApi.PHP',
    'Description': 'Local server.'
  }
];

var logLevels = {
  log: ['background-color: #008000; color: white; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #000000;'],
  level1: ['background-color: #00a400; color: white; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #333333;'],
  level2: ['background-color: #5f915b; color: white; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #666666;'],
  level3: ['background-color: #8bb588; color: white; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #999999;'],

  init: ['background-color: #1166cc; color: white; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #1166cc;'],
  init1: ['background-color: #237eed; color: white; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #237eed;'],
  init2: ['background-color: #4d96f0; color: white; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #4d96f0;'],
  init3: ['background-color: #78aff3; color: white; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #78aff3;'],

  call: ['background-color: #cccccc; color: #555555; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #333333; font-style: italic;'],
  call1: ['background-color: #cccccc; color: #666666; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #555555; font-style: italic;'],
  call2: ['background-color: #cccccc; color: #777777; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #777777; font-style: italic;'],
  call3: ['background-color: #cccccc; color: #999999; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #999999; font-style: italic;'],

  render: ['background-color: #400080; color: white; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #400080; font-style: italic;'],
  render1: ['background-color: #6700ce; color: white; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #400080; font-style: italic;'],
  render2: ['background-color: #972fff; color: white; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #400080; font-style: italic;'],
  render3: ['background-color: #d3a8ff; color: white; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #400080; font-style: italic;'],

  request: ['background-color: #8dd5d8; color: #408080; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #408080;'],
  response: ['background-color: #8dd5d8; color: #408080; border-radius: 4px; padding: 1px 4px 1px 4px;', 'color: #408080;']
};

var languages = {
  'en': null,
  'ru': require('./Localization/ru.json'),
  'de': require('./Localization/de.json')
};

module.exports = Object.keys(languages).map(function(language) {
  return {
    context: path.join(__dirname, 'src'),

    resolve: {
      modulesDirectories: ['./', 'node_modules'],
      extensions: ['', '.webpack.js', '.web.js', '.js'],
      alias: {
        'default-theme': path.join(__dirname, 'Content/Styles/v1/bundle.scss'),

        // you can use
        // import Debug from 'debug';
        // instead
        // import Debug from 'Helpers/Debug';
        // see also /local.d.ts
        'debug': 'Helpers/Debug',

        // you can use
        // import Header from 'UI/Header';
        // instead
        // import Header from '../UI/Header';
        // etc.
        'Core': 'Core',
        'API': 'API',
        'UI': 'UI',
        'UI/Layout': 'UI/Layout',
        'Layouts': 'Layouts',
        'Helpers': 'Helpers',
        'Modules': 'Modules'
      }
    },

    entry: { 'app': './AppStart/Init.js' },

    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '/dist/',
      filename: 'scripts/' + language + '/[name].js',
      chunkFilename: 'scripts/' + language + '/chunks/[id].js'
    },

    devServer: {
      contentBase: '.',
      host: 'localhost',
      port: 9090,
      historyApiFallback: true
    },

    plugins: [
      new webpack.OldWatchingPlugin(),
      new webpackNotifierPlugin({ title: 'SmallServerAdminV2' }),

      new i18nPlugin(languages[language]),

      // https://webpack.github.io/docs/list-of-plugins.html#hotmodulereplacementplugin
      new webpack.HotModuleReplacementPlugin(),

      // provides file compression
      // https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      /*new webpack.optimize.UglifyJsPlugin({
        compress: process.env.NODE_ENV === 'production'
      }),*/

      // remove duplicate modules
      new webpack.optimize.DedupePlugin(),

      // TODO: external file for DefinePlugin

      // application-level constants
      new webpack.DefinePlugin({
        // 'CONSTANT_NAME': 'VALUE'

        // application mode: production | development
        'process.env': {
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV) // do not change this string
        },

        'DEV_MODE': JSON.stringify(process.env.NODE_ENV == 'development'),

        'LOG_LEVELS': JSON.stringify(logLevels),

        // SmallServerAdmin version. For example: 2.0.0-alpha, 2.0.0-beta, 2.0.0
        'SSA_VERSION': JSON.stringify('2.0.0-alpha'),

        // date release (yyyy-mm-dd)
        'SSA_DATE_RELEASE': JSON.stringify('unreleased'),

        // list of api servers
        'SSA_API_SERVERS': JSON.stringify(apiServers)
      }),

      // https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
      new webpack.optimize.CommonsChunkPlugin({
        async: true,
        minChunks: Infinity,
        children: false
      }),

      // https://webpack.github.io/docs/list-of-plugins.html#provideplugin
      new webpack.ProvidePlugin({
        '$': 'jquery',
        'jQuery': 'jquery',
        'react': 'react',
        'React': 'react',
        'ReactDOM': 'react-dom',
        'ReactUpdate': 'react-addons-update',
        'Debug': 'debug', // see alias 'Helpers/Debug'
        'IMainContext': 'Layouts/IMainContext'
      }),

      // https://github.com/ampedandwired/html-webpack-plugin
      new htmlWebpackPlugin({
        title: 'SmallServerAdminV2',
        // favicon: ,
        filename: path.join(__dirname, 'index.html'),
        template: path.join(__dirname, 'Templates', 'index.html'),
        chunks: [], // always empty
        hash: true
      }),

      // https://github.com/mixtur/webpack-spritesmith

      // #region TODO: auto generation config for sprites

      /*var fs = require('fs');

        var files = fs.readdirSync(path.join(__dirname, 'Content/Sprites'));

        for (var i in files) {
          console.log('files[i]', files[i]);
          if (fs.statSync(name).isDirectory()) {
    
          } else {
    
          }
      }*/
      new spritesmithPlugin({
        'src': {
          'cwd': path.resolve(__dirname, 'Content', 'Sprites', 'lang'),
          'glob': '*.png'
        },
        'target': {
          'image': path.resolve(__dirname, 'dist', 'images', 'lang.png'),
          'css': path.resolve(__dirname, 'Content', 'Styles', 'v1', '.sprites', 'lang.scss')
        },
        'apiOptions': {
          'cssImageRef': '/dist/images/lang.png'
        }
      }),

      new spritesmithPlugin({
        'src': {
          'cwd': path.resolve(__dirname, 'Content', 'Sprites', 'web-servers'),
          'glob': '*.png'
        },
        'target': {
          'image': path.resolve(__dirname, 'dist', 'images', 'web-servers.png'),
          'css': path.resolve(__dirname, 'Content', 'Styles', 'v1', '.sprites', 'web-servers.scss')
        },
        'apiOptions': {
          'cssImageRef': '/dist/images/web-servers.png'
        }
      })

      // #endregion
    ],

    module: {

      // http://webpack.github.io/docs/loaders.html
      loaders: [
        // TypeScript -> ES2015 -> Asynchronous Module Definition (AMD)
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['es2015', 'react'],
            plugins: ['transform-es2015-modules-amd']
          }
        },

        // https://github.com/jtangelder/sass-loader
        {
          test: /\.scss$/,
          loaders: ['style', 'css', 'sass']
        },

        // fonts
        {
          test: /\.woff(.*)$/,
          loader: 'url',
          query: {
            limit: 10000,
            mimetype: 'application/font-woff',
            name: 'fonts/[name].[ext]'
          }
        },
        {
          test: /\.woff2(.*)$/,
          loader: 'url',
          query: {
            limit: 10000,
            mimetype: 'application/font-woff',
            name: 'fonts/[name].[ext]'
          }
        },
        {
          test: /\.ttf(.*)$/,
          loader: 'url',
          query: {
            limit: 10000,
            mimetype: 'application/octet-stream',
            name: 'fonts/[name].[ext]'
          }
        },
        {
          test: /\.eot(.*)$/,
          loader: 'file',
          query: {
            limit: 10000,
            name: 'fonts/[name].[ext]'
          }
        },
        {
          test: /\.svg(.*)$/,
          loader: 'url',
          query: {
            limit: 10000,
            mimetype: 'image/svg+xml',
            name: 'fonts/[name].[ext]'
          }
        }
      ]
    },

    /*sassLoader: {
      includePaths: [path.resolve(__dirname, './Content/Styles')]
    }*/

  };
});