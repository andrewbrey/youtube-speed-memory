const ExtensionReloader = require('webpack-extension-reloader');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	output: {
		pathinfo: true,
	},
	plugins: [
		new ExtensionReloader({
			port: 9090,
		}),
	],
	module: {
		rules: [],
	},
};
