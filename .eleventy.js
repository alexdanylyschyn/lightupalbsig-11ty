const Image = require("@11ty/eleventy-img");
const filters = require("./utils/filters.js");
const transforms = require("./utils/transforms.js");
const collections = require("./utils/collections.js");

async function imageShortcode(src, alt, sizes) {
	let metadata = await Image("./src/static/" + src, {
		widths: [300, 600],
		formats: ["avif", "jpeg"],
		urlPath: "/static/img/",
		outputDir: "./dist/static/img/",
	});

	let imageAttributes = {
		alt,
		sizes,
		loading: "lazy",
		decoding: "async",
	};

	// You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
	return Image.generateHTML(metadata, imageAttributes, {
		whitespaceMode: "inline",
	});
}

async function imagePngShortcode(src, alt, sizes) {
	let metadata = await Image('./src/static/' + src, {
		widths: [300, 600],
		formats: ["avif", "png"],
		urlPath: "/static/img/",
		outputDir: "./dist/static/img/"
	});

	let imageAttributes = {
		alt,
		sizes,
		loading: "lazy",
		decoding: "async",
	};

	// You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
	return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline"
  });
}

module.exports = function (eleventyConfig) {
	// Folders to copy to build dir (See. 1.1)
	eleventyConfig.addPassthroughCopy("src/static");

	// images
	eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
	eleventyConfig.addNunjucksAsyncShortcode("imagePng", imagePngShortcode);

	// Filters
	Object.keys(filters).forEach((filterName) => {
		eleventyConfig.addFilter(filterName, filters[filterName]);
	});

	// Transforms
	Object.keys(transforms).forEach((transformName) => {
		eleventyConfig.addTransform(transformName, transforms[transformName]);
	});

	// Collections
	Object.keys(collections).forEach((collectionName) => {
		eleventyConfig.addCollection(collectionName, collections[collectionName]);
	});

	// This allows Eleventy to watch for file changes during local development.
	eleventyConfig.setUseGitIgnore(false);

	eleventyConfig.setBrowserSyncConfig({
		cors: true
	});

	return {
		dir: {
			input: "src/",
			output: "dist",
			includes: "_includes",
			layouts: "_layouts",
		},
		templateFormats: ["html", "md", "njk"],
		htmlTemplateEngine: "njk",

		// 1.1 Enable eleventy to pass dirs specified above
		passthroughFileCopy: true,
	};
};
