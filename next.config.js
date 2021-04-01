module.exports = {
	target: "serverless",
	unstableNetlifyFunctionsSupport: {
		'pages/[...slug].tsx': {
			includeDirs: ['./.next/cache/agility']
		},
		'pages/index.tsx': {
			includeDirs: ['./.next/cache/agility']
		}
	}
}