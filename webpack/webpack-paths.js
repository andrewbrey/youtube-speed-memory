const RESOLVE = require('path').resolve;

module.exports = {
	outputPath: RESOLVE(__dirname, '../', `extensions/${process.env.TARGET}`),
	srcPath: RESOLVE(__dirname, '../src/scripts'),
	stylesheetsPath: RESOLVE(__dirname, '../src/styles'),
};
