module.exports = {
	target: "serverless",
	functions: {
		'pages/[...slug].jsx': {
			includeDirs: ['./cache']
		}
	}
}