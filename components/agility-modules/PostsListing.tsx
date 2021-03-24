import React from 'react';
import { ModuleWithInit, renderHTML } from '@agility/nextjs'
import truncate from 'truncate-html'
import Link from 'next/link';
import { motion } from "framer-motion"
import Parallax from 'components/common/Parallax';

interface IPostListing {
	title: string,
	subtitle: string,
	preHeader: string,
}

interface Post {
	contentID: Number,
	title: string,
	url: string,
	category: string,
	author: string,
	description: string,
	imageSrc: string,
	imageAlt: string,
	dateStr: string
}

interface CustomData {
	posts: [Post]
}

const PostListing: ModuleWithInit<IPostListing, CustomData> = ({ module, customData }) => {
	const fields = module.fields
	let href = "/pages/[...slug]"
console.log(customData.posts)
	return (
		<section className="my-12 bg-white">
			<div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
				<Parallax>
					<div className="lg:text-center">
						<p className="text-base leading-6 text-indigo-600 font-semibold tracking-wide uppercase">
							{fields.preHeader}
						</p>
						<h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
							{fields.title}
						</h3>
						<p className="mt-4 max-w-2xl text-xl leading-7 text-gray-500 lg:mx-auto">
							{fields.subtitle}
						</p>
					</div>
				</Parallax>
				<div className="mt-10">
					<ul className="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
						{customData.posts.map(post => {
							return (
								<li key={`post-${post.contentID}`}>
									<Parallax>
									<Link href={href} as={post.url}>
										<a className="flex" >
											<div className="flex-shrink-0">


												{post.imageSrc &&
													<motion.div className="flex items-center justify-center  rounded-md bg-indigo-500 text-white" layoutId={`postimg-${post.contentID}`}>
														<img className="h-20 w-20 rounded-md" src={`${post.imageSrc}?w=100&h=100`} alt={post.imageAlt} loading="lazy" />
													</motion.div>
												}


											</div>
											<div className="ml-4">
												<motion.h4 className="text-lg leading-6 font-medium text-gray-900" layoutId={`posttitle-${post.contentID}`}>
													{post.title}
												</motion.h4>

												<div>
													<div className="inline-block" >
														<motion.div layoutId={`postcategory-${post.contentID}`}>{post.category}</motion.div>
													</div>
													<motion.div className="ml-2 inline-block" layoutId={`postauthor-${post.contentID}`}>{post.author}</motion.div>

													<motion.div className="ml-2 inline-block" layoutId={`postdate-${post.contentID}`}>{post.dateStr}</motion.div>

												</div>
												<p className="mt-2 text-base leading-6 text-gray-500">
													{post.description}
												</p>

											</div>
										</a>
									</Link>
									</Parallax>
								</li>
							)
						})}

					</ul>
				</div>
			</div>
		</section>
	)
}

const resolvePostUrls = function (sitemap, posts) {
	let dynamicUrls = {};
	posts.forEach(post => {

		Object.keys(sitemap).forEach(path => {
			if (sitemap[path].contentID === post.contentID) {
				dynamicUrls[post.contentID] = path;
			}
		})

	})
	return dynamicUrls;
}

PostListing.getCustomInitialProps = async ({ agility, channelName, languageCode }) => {
	const api = agility;

	try {

		//get sitemap first, need it to find the dynamic urls
		let sitemap = await api.getSitemap({ channelName: channelName, languageCode });

		//then get our posts
		let rawPosts = await api.getContentList({ referenceName: 'posts', languageCode });

		//then get our categories and authors
		let categories = await api.getContentList({ referenceName: 'categories', languageCode });
		let authors = await api.getContentList({ referenceName: 'authors', languageCode });

		const dynamicUrls = resolvePostUrls(sitemap, rawPosts)

		const posts: [Post] = rawPosts.map(post => {

			const categoryID = post.fields.category?.contentid;
			const authorID = post.fields.author?.contentid;

			const category = categories?.find(c => c.contentID == categoryID);
			const author = authors?.find(a => a.contentID == authorID);
			const url = dynamicUrls[post.contentID] || "#"

			let imageSrc = post.fields.image?.url || null
			let imageAlt = post.fields.image?.label || ""
			const description = truncate(post.fields.content, { length: 160, decodeEntities: true, stripTags: true, reserveLastWord: true })

			let dateStr = null;
			try {
				//try to format the date with the current lang
				dateStr = new Date(post.fields.date).toLocaleDateString(languageCode)
			} catch (e) {
				dateStr = new Date(post.fields.date).toLocaleDateString()
			}

			return {
				contentID: post.contentID,
				title: post.fields.title,
				url,
				category: category?.fields.title || null,
				author: author?.fields.name || null,
				description,
				imageSrc,
				imageAlt,
				dateStr
			}
		});

		return {
			posts
		};

	} catch (error) {
		if (console) console.error(error);
	}
}

export default PostListing


