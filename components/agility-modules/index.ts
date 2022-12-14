import RichTextArea from "./RichTextArea";
import HeroBackgroundAsImage from "./HeroBackgroundAsImage";
import PostsListing from "./PostsListing";
import PostDetails from "./PostDetails";
import TextBlockWithImage from "./TextBlockWithImage";

/**
 * All of the Agility Module components that are in use in this site.
 */
const allModules = [
  { name: "HeroBackgroundAsImage", module: HeroBackgroundAsImage },
  { name: "PostsListing", module: PostsListing },
  { name: "PostDetails", module: PostDetails },
  { name: "RichTextArea", module: RichTextArea },
  { name: "TextBlockWithImage", module: TextBlockWithImage },
];

/**
 * Find the component for a module by name.
 * @param moduleName
 */
export const getModule = (moduleName: string): any | null => {
  if (!moduleName) return null;
  const obj = allModules.find(
    (m) => m.name.toLowerCase() === moduleName.toLowerCase()
  );
  if (!obj) return null;
  return obj.module;
};
