const { withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function withKotlinVersion(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents) {
      // Update Kotlin version to 2.0.0
      config.modResults.contents = config.modResults.contents.replace(
        /kotlinVersion\s*=\s*['"][\d.]+['"]/g,
        'kotlinVersion = "2.0.0"'
      );
      
      // Also handle ext.kotlin_version if it exists
      config.modResults.contents = config.modResults.contents.replace(
        /ext\.kotlin_version\s*=\s*['"][\d.]+['"]/g,
        'ext.kotlin_version = "2.0.0"'
      );
    }
    return config;
  });
};
