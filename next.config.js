module.exports = {
	target: "serverless",
	future: {
		webpack5: false,
	},
	unstableNetlifyFunctionsSupport: {
		'pages/[...slug].tsx': {
			includeDirs: ['agility']
		},

		'pages/index.tsx': {
			includeDirs: ['agility']
		}
	}
}