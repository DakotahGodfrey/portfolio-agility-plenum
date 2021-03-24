import React, { FC } from 'react';
import { ContentItem, ImageField, ModuleWithDynamic, renderHTML } from '@agility/nextjs'
import { motion } from "framer-motion"

interface Tag {
	title: String
}

interface Category {
	title: String
}

interface Author {
	name: String
}

interface Post {
	title: string
	date: string,
	content: string
	image: ImageField
	category: ContentItem<Category>
	author: ContentItem<Author>
	tags: [ContentItem<Tag>]
}


const PostDetails: ModuleWithDynamic<any, Post> = ({ dynamicPageItem, languageCode }) => {

	const post = dynamicPageItem.fields
	const category = post.category?.fields.title
	const author = post.author?.fields.name
	const tagNames = post.tags?.map(tag => tag.fields.title).join(", ")

	let dateStr = null;
	try {
		//try to format the date with the current lang
		dateStr = new Date(post.date).toLocaleDateString(languageCode)
	} catch (e) {
		dateStr = new Date(post.date).toLocaleDateString()
	}



	return (

		<article className="my-6">
			<motion.div layoutId={`posttitle-${dynamicPageItem.contentID}`}>
				<h1 className="text-4xl sm:text-5xl font-black tracking-wide text-center text-gray-900 mb-10" >
					{post.title}
				</h1>
			</motion.div>

			<div className="text-center">
				<div className="font-medium text-primary-700"><motion.div  layoutId={`postcategory-${dynamicPageItem.contentID}`}>{category}</motion.div></div>
				<motion.div className="font-bold text-lg sm:text-xl lg:text-2xl text-secondary-500 tracking-wide" layoutId={`postauthor-${dynamicPageItem.contentID}`}>{author}</motion.div>
				<motion.div className="" layoutId={`postdate-${dynamicPageItem.contentID}`}>{dateStr}</motion.div>
				<div className="text-gray-700">{tagNames}</div>


					<div className="my-2 flex items-center justify-center">

						<motion.picture className="rounded" layoutId={`postimg-${dynamicPageItem.contentID}`}>
							<source srcSet={`${post.image.url}?w=1024`}
								media="(min-width: 1400px)" />
							<source srcSet={`${post.image.url}?w=700`}
								media="(min-width: 1000px)" />

							<img className="rounded" src={`${post.image.url}?w=400`} alt={post.image.label} loading="lazy" />
						</motion.picture>

					</div>



			</div>
			<div className="p-10 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full" style={{ maxWidth: "100%" }}
				dangerouslySetInnerHTML={renderHTML(post.content)}>
			</div>

		</article>

	)
}


export default PostDetails


