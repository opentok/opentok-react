module.exports = function(config) {
  config.set({
    mutator: "javascript",
    packageManager: "npm",
    reporters: ["clear-text", "progress"],
    testRunner: "karma",
    testFramework: "jasmine",
    coverageAnalysis: "off",
    karma: {
      projectType: "custom",
      configFile: "karma.conf.js",
      config: {}
    },
  });
};
