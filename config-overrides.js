const { injectBabelPlugin } = require('react-app-rewired');

module.exports = function override(config, env) {
    console.log( "hello from: config-overrides.js, 4" );
    config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }], config);
    return config;
};