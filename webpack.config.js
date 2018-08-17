const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin();

const nodeEnv = process.env.NODE_ENV || 'production';

module.exports = smp.wrap({
  devtool: 'source-map',
  entry: {
    filename: './src/scripts/app.js'
  },
  output: {
    filename: 'bundle.js'
  },
  externals: {
    flashcards: 'flashcards'
  },
  mode: 'production',
  watchOptions: {
    ignored: /node_modules/
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules|assets|BBdeploy\.js/,
        loader: 'eslint-loader',
        options: {
          cache: true
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules|assets|BBdeploy\.js/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './assets/[name].[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.sass$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.handlebars$/,
        loader: 'handlebars-loader',
        options: {
          inlineRequires: '/assets/'
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: false,
        parallel: true,
        cache: true
      })
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    }),
    new HtmlWebpackPlugin({
      hash: true,
      filename: 'index.html',
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle.css'
    })
  ]
});
