module.exports = {
  extends: '../src/.eslintrc.js',
  plugins: [
    'jasmine'
  ],
  env: {
    jasmine: true
  },
  rules: {
    'no-console': 'off'
  }
};
