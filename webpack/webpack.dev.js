const ExtensionReloader = require('webpack-extension-reloader');
const { join } = require('path');
const { srcPath } = require('./webpack-paths');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	resolve: {
		alias: {
			'@global/env': join(srcPath, 'global', 'environment.dev'),
		},
	},
	output: {
		pathinfo: true,
	},
	plugins: [
		new ExtensionReloader({
			port: 9090,
			entries: {
				contentScript: ['ysm'],
				background: 'background',
				extensionPage: ['popup', 'options'],
			},
			reloadPage: false,
		}),
	],
	module: {
		rules: [],
	},
};
