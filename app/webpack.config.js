'use strict';

var path = require('path');
var webpack = require('webpack');
var webpackNotifierPlugin = require('webpack-notifier');
var spritesmithPlugin = require('webpack-spritesmith');
var htmlWebpackPlugin = require('html-webpack-plugin');
var webpackStrip = require('strip-loader');
var copyWebpackPlugin = require('copy-webpack-plugin');

var logLevels = require(path.join(__dirname, 'debug.config.js')).logLevels;

module.exports = {
  context: path.join(__dirname, 'src'),

  resolve: {
    modulesDirectories: ['./', 'node_modules'],
    extensions: ['', '.webpack.js', '.web.js', '.js'],
    alias: {
      'default-theme': path.join(__dirname, 'Content/Styles/v1/bundle.scss'),

      // you can use
      // import Header from 'UI/Header';
      // instead
      // import Header from '../UI/Header';
      // etc.
      'Core': 'Core',
      'Actions': 'Actions',
      'Pages': 'Pages',
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
    filename: 'scripts/[name].js',
    chunkFilename: 'scripts/chunks/[id].js'
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

      'DEV_MODE': JSON.stringify(process.env.NODE_ENV === 'development'),

      'LOG_LEVELS': JSON.stringify(logLevels),

      // SmallServerAdmin version. For example: 2.0.0-alpha, 2.0.0-beta, 2.0.0
      'SSA_VERSION': JSON.stringify('2.0.0-alpha'),

      // date release (yyyy-mm-dd)
      'SSA_DATE_RELEASE': JSON.stringify('unreleased'),
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
      'Debug': 'Helpers/Debug'
    }),

    // https://github.com/ampedandwired/html-webpack-plugin
    new htmlWebpackPlugin({
      title: 'SmallServerAdminV2',
      // favicon: ,
      filename: path.join(__dirname, 'index.html'),
      template: path.join(__dirname, 'Templates', 'index.html'),
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
    }),

    new spritesmithPlugin({
      'src': {
        'cwd': path.resolve(__dirname, 'Content', 'Sprites', 'os-icons24'),
        'glob': '*.png'
      },
      'target': {
        'image': path.resolve(__dirname, 'dist', 'images', 'os-icons24.png'),
        'css': path.resolve(__dirname, 'Content', 'Styles', 'v1', '.sprites', 'os-icons24.scss')
      },
      'apiOptions': {
        'cssImageRef': '/dist/images/os-icons24.png'
      }
    }),

    new spritesmithPlugin({
      'src': {
        'cwd': path.resolve(__dirname, 'Content', 'Sprites', 'os-icons48'),
        'glob': '*.png'
      },
      'target': {
        'image': path.resolve(__dirname, 'dist', 'images', 'os-icons48.png'),
        'css': path.resolve(__dirname, 'Content', 'Styles', 'v1', '.sprites', 'os-icons48.scss')
      },
      'apiOptions': {
        'cssImageRef': '/dist/images/os-icons48.png'
      }
    }),

    // #endregion

    // https://www.npmjs.com/package/copy-webpack-plugin
    new copyWebpackPlugin([
      { 'from': path.resolve(__dirname, 'Content', 'Images'), 'to': path.resolve(__dirname, 'dist', 'images') }
    ])
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

      // remove Debug
      // https://github.com/yahoo/strip-loader
      (process.env.NODE_ENV === 'development' ? { test: /\.abc123$/  } : {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: webpackStrip.loader(
          'Debug.Log', 'Debug.Level1', 'Debug.Level2', 'Debug.Level3',
          'Debug.Call', 'Debug.Call1', 'Debug.Call2', 'Debug.Call3',
          'Debug.Render', 'Debug.Render1', 'Debug.Render2', 'Debug.Render3',
          'Debug.Init', 'Debug.Init1', 'Debug.Init2', 'Debug.Init3',
          'Debug.Warn', 'Debug.Warning', 'Debug.Error', 'Debug.Info',
          'Debug.Request', 'Debug.Response'
        )
      }),

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
  }

};