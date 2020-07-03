module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  plugins: [
    'react',
    'jsx-a11y',
    'import'
  ],
  globals: {
    OT: true
  },
  env: {
    browser: true,
  },
  rules: {
    'no-confusing-arrow': ['error', { allowParens: true }],
    'react/jsx-filename-extension': 'off',
    'react/forbid-prop-types': ['error', { forbid: ['any', 'array'] }]
  }
};
