import webpack from 'webpack';
import path from 'path';

const { NODE_ENV } = process.env;

let plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  }),
];

const filename = `nmodel${NODE_ENV === 'production' ? '.min' : ''}.js`;

if (NODE_ENV === 'production') {
  plugins = plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false,
      },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ]);
}

export default {
  entry: [
    './src/index',
  ],

  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ },
    ],
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'NModel',
    libraryTarget: 'umd',
  },

  plugins,
};
