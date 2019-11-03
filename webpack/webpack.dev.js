const ExtensionReloader = require('webpack-extension-reloader');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	output: {
		pathinfo: true,
	},
	plugins: [
		new ExtensionReloader(),
	],
	module: {
		rules: [],
	},
};
