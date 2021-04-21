import React, {FC} from 'react';
import { renderHTML, Module } from '@agility/nextjs'
import { motion } from "framer-motion"
import Parallax from 'components/common/Parallax';

interface RichText {
	textblob:string,
}

const RichTextArea:Module<RichText> =  ({ module: {fields: {textblob}} }) => {

	return (
		<Parallax>
		<section className="my-6 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-full" dangerouslySetInnerHTML={renderHTML(textblob)}>
		</section>
		</Parallax>


	);

}

export default RichTextArea