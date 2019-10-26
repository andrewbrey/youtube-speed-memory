const CHALK = require('chalk');
const MERGE = require('webpack-merge');

module.exports = () => {
	const CONFIG_VARIANT = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';

	console.log(
		CHALK.bold(
			`Webpack building for ${CHALK.bold.underline.green(process.env.TARGET)} with ${CHALK.bold.underline.green(
				CONFIG_VARIANT
			)} configuration!\n`
		)
	);

	return MERGE(require('./webpack.common'), require(`./webpack.${CONFIG_VARIANT}.js`));
};
