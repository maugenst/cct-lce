module.exports = {
  extends: [require.resolve('eslint-config-airbnb-base'), 'plugin:jest/recommended'],
  plugins: ['jest'],
  rules: {
    // let git (.gitattributes) handle this
    'linebreak-style': 'off',
    // allow unused function arguments for convenience and documentary purposes
    'no-unused-vars': ['error', { 'vars': 'all', 'args': 'none' }]
  },
  overrides: [
    {
      files: [
        '**/*.test.js'
      ],
      env: {
        jest: true
      }
    }
  ]
};
