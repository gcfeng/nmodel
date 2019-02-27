import path from 'path';

const { NODE_ENV } = process.env;

const mode = NODE_ENV === 'production' ? 'production' : 'development';
const filename = `nmodel${NODE_ENV === 'production' ? '.min' : ''}.js`;

export default {
  mode,

  devtool: NODE_ENV === 'production' ? false : 'source-map',

  entry: [
    './src/index',
  ],

  module: {
    rules: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ },
    ],
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'NModel',
    libraryTarget: 'umd',
  },
};
