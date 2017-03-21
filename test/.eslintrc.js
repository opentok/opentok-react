module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  plugins: [
    'react',
    'jsx-a11y',
    'import',
    'jasmine'
  ],
  globals: {
    OT: true
  },
  env: {
    browser: true,
    jasmine: true
  },
  rules: {
    'no-console': 'off',
    'react/jsx-filename-extension': 'off'
  }
};
