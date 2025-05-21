const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { IgnorePlugin } = require('webpack');

module.exports = {
  entry: './src/main.ts',
  target: 'node',
  externals: [],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
        extractComments: false,
      }),
    ],
  },
  plugins: [
    // Ignorar archivos de desarrollo
    new IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
}; 