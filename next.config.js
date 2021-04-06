module.exports = {
	target: "serverless",
	future: {
		webpack5: false,
	},
	unstableNetlifyFunctionsSupport: {
		'pages/[...slug].tsx': {
			includeDirs: ['./.next/cache/agility']
		},
		'pages/index.tsx': {
			includeDirs: ['./.next/cache/agility']
		}
	},
	webpack: (config, { isServer }) => {
		// Fixes npm packages that depend on `fs` module
		if (!isServer) {
		  config.node = {
			fs: 'empty'
		  }
		}

		return config
	  }
}