module.exports = {
  root: true,
  env: {
    node: true,
    'es6': true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'mainnet' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'mainnet' ? 'warn' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
