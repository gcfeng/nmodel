const { NODE_ENV } = process.env;

module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', {
      targets: {
        browsers: ['> 5%', 'last 2 versions', 'not ie <= 8']
      },
      exclude: ['transform-async-to-generator', 'transform-regenerator'],
      modules: false,
      loose: true
    }]
  ],
  plugins: [
    NODE_ENV === 'test' && '@babel/plugin-transform-modules-commonjs',
  ].filter(Boolean)
};
