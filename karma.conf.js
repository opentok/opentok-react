module.exports = config => {
  const browser = process.env.BROWSER || 'chrome';

  config.set({
    basePath: '',
    frameworks: ['browserify', 'jasmine'],
    files: [
      'https://static.opentok.com/v2/js/opentok.js',
      'test/**/*.js'
    ],
    preprocessors: {
      'src/**/*.js': ['babel', 'browserify'],
      'test/**/*.js': ['babel', 'browserify']
    },
    browserify: {
      debug: true,
      transform: [
        ['babelify']
      ],
      configure: bundle => {
        bundle.on('prebundle', () => {
          bundle.external('react/addons');
          bundle.external('react/lib/ReactContext');
          bundle.external('react/lib/ExecutionEnvironment');
        });
      }
    },
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    browsers: [browser[0].toUpperCase() + browser.substr(1)],
    singleRun: false
  });
};
