import type {
	GetStaticPathsContext,
	GetStaticPropsContext,
	InferGetStaticPropsType,

} from 'next'

import Layout from "components/common/Layout"

import { getAgilityPageProps, getAgilityPaths } from "@agility/nextjs/node"
import { AgilityPageProps, handlePreview } from "@agility/nextjs"
import { getModule } from "components/agility-modules"
import GlobalHeader from "components/common/GlobalHeader"
import GlobalFooter from "components/common/GlobalFooter"
import LoadingWidget from "components/common/LoadingWidget"

import { unlinkSync, existsSync } from "fs"

export async function getStaticProps({ preview, params, locale, defaultLocale, locales }: GetStaticPropsContext<{ slug: string[] }>) {

	try {
		const globalComponents = {
			"header": GlobalHeader,
			"footer": GlobalFooter
		}

		if (params === undefined) params = null
		if (preview === undefined) preview = false
		if (locale === undefined) locale = null
		if (defaultLocale === undefined) defaultLocale = null
		if (defaultLocale === undefined) defaultLocale = null

		//hack delete the incremental

		console.log("Folder", process.cwd())

		//determine if we've already done a full build yet
		const buildFilePath = `${process.cwd()}/.next/cache/agility/build.log`

		if (existsSync(`${process.cwd()}/.next/cache/agility/3440d72f/live/en-us/sitemap/website.json`)) {
			console.log("THE sitemap is here")
		}

		if (existsSync(buildFilePath)) {
			console.log("REMOVING BUILD FILE PATH")
			unlinkSync(buildFilePath)
		}

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

