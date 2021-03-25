module.exports = {
	target: "serverless",
	functions: {
		'pages/[...slug].tsx': {
			includeDirs: ['./next/to/json']
		}
	}
}