module.exports = {
	plugins: [
		require('postcss-import')({}),
		require('tailwindcss'),
		require('postcss-nesting')(),
		require('postcss-custom-properties')({
			preserve: false,
		}),
		require('autoprefixer')({}),
		...(process.env.NODE_ENV === 'production'
			? [
					require('@fullhuman/postcss-purgecss')({
						content: ['./src/**/*.html', './src/**/*.ts'],
						defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
					}),
			  ]
			: []),
	],
};
