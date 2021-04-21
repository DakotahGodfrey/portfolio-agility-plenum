import type {
	GetStaticPathsContext,
	GetStaticPropsContext,
	InferGetStaticPropsType,

} from 'next'

import Layout from "components/common/Layout"

import { getAgilityPageProps, getAgilityPaths } from "@agility/nextjs/node"
import { handlePreview } from "@agility/nextjs"
import { getModule } from "components/agility-modules"
import GlobalHeader from "components/common/GlobalHeader"
import GlobalFooter from "components/common/GlobalFooter"
import LoadingWidget from "components/common/LoadingWidget"

import { unlinkSync, existsSync, readdirSync } from "fs"
import path from "path"



export async function getStaticProps({ preview, params, locale, defaultLocale, locales }: GetStaticPropsContext<{ slug: string[] }>) {



const traverse = (rootPath, depth) => {

	if (depth > 0) return

	if (!existsSync(rootPath)) {
		console.log(`${rootPath} does not exist`)
		return
	}

	try {
		const listing = readdirSync(rootPath, { withFileTypes: true })

		let indent = " "
		for (let i = 0; i < depth; i++) indent += " "

		//listing all files using forEach
		listing.forEach(sub => {

			if (sub.isDirectory()) {
				console.log(`${indent} * ${sub.name}`);
				traverse(path.resolve(rootPath, sub.name), depth + 1)
			} else {
				console.log(`${indent} - ${sub.name}`);
			}
		})
	} catch (e) {
		return
	}
}


	const testPath = path.join(process.cwd(),  "agility")

	console.log("Traverse: ", testPath)

	traverse(testPath, 0)


	try {
		const globalComponents = {
			"header": GlobalHeader,
			"footer": GlobalFooter
		}

		// if (params === undefined) params = null
		// if (preview === undefined) preview = false
		// if (locale === undefined) locale = null
		// if (defaultLocale === undefined) defaultLocale = null

		const agilityProps = await getAgilityPageProps({ preview, params, locale, getModule, defaultLocale, globalComponents });


		let rebuildFrequency = 10

		if (!agilityProps) {
			// We throw to make sure this fails at build time as this is never expected to happen
			throw new Error(`Page not found`)
		}

		return {
			props: agilityProps,
			revalidate: rebuildFrequency
		}
	} catch (err) {
		var e = new Error();
		const st = e.stack;

		console.log("Error getting page props", params, err)

		return {
			props: {
				error: `Params: ${params}, Error: ${err}, Stack: ${st}`,
				revalidate: 1000
			}
		}
	}
}

export async function getStaticPaths({ locales, defaultLocale }: GetStaticPathsContext) {

	//get the paths configured in agility
	let agilityPaths = await getAgilityPaths({ preview: false, locales, defaultLocale })

	return {
		paths: agilityPaths,
		fallback: true,
	}
}


const AgilityPage = (props: any) => {

	if (handlePreview()) {
		return <LoadingWidget message="Activating preview mode..." />
	}

	return <Layout {...props} />;
}

export default AgilityPage

