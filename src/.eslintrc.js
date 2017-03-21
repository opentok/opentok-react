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
    'react/jsx-filename-extension': 'off'
  }
};
