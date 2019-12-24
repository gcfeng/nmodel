import path from 'path';

const { NODE_ENV } = process.env;

const mode = NODE_ENV === 'production' ? 'production' : 'development';
const filename = `nmodel${NODE_ENV === 'production' ? '.min' : ''}.js`;

export default {
  mode,

  devtool: NODE_ENV === 'production' ? false : 'source-map',

  entry: ['./src/index'],

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'NModel',
    libraryTarget: 'umd',
  },
};
