const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './game.js',
  output: {
    path: __dirname + '/assets',
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/',
  },
  resolve: {
    alias: {
      jquery: path.resolve(__dirname, 'node_modules/jquery/src/jquery'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['env'] },
        },
      },
      {
        test: /^((?!\.module).)*css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    contentBase: './',
    port: 8080,
    noInfo: false,
    hot: true,
    inline: true,
    proxy: {
      '*': {
        bypass: function (req, res, proxyOptions) {
          return '/assets/index.html';
        },
      },
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'global.jQuery': 'jquery',
      'window.jQuery': 'jquery',
    }),
  ],
};
