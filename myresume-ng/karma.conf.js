// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    files: [
      { pattern: 'src/**/*.ts', type: 'module', watched: false }
    ],

    mime: {
      'application/javascript': ['ts', 'tsx']
    },
    plugins: [
      require('karma-jasmine'),
      require('karma-typescript'),
      require('karma-firefox-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json', // Point to your tsconfig.json
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/, // This will only bundle your spec files for testing
      },
      transformPath: function (filepath) {
        return filepath.replace(/\.(ts|tsx)$/, '.js');
      }
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/myresume-ng'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true,
    },
    reporters: ['progress', 'kjhtml', 'karma-typescript'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Firefox'],
    singleRun: false,
    restartOnFileChange: true,
  });
};
