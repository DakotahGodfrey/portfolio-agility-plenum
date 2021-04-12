const netlifyConfig = {
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
	}
}

const vercelConfig = {
	future: {
		webpack5: true,
	},
}

if (process.env.NETLIFY != true) {
console.log("using vercel config...")
	module.exports = vercelConfig
} else {
	module.exports = netlifyConfig
}