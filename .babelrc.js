module.exports = {
  presets: [
    [
      '@babel/preset-env',
      process.env.NODE_ENV === 'test'
        ? {
            targets: {
              node: 'current'
            }
          }
        : {
            targets: {
              browsers: ['ie >= 11']
            },
            modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false,
            loose: true
          }
    ]
  ],
  plugins: ['@babel/plugin-proposal-object-rest-spread']
};
