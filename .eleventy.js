const handlebarsPlugin = require("@11ty/eleventy-plugin-handlebars");

module.exports = function (eleventyConfig) {
  // Handlebars was removed from Eleventy core in v3; it now ships as a plugin.
  eleventyConfig.addPlugin(handlebarsPlugin);

  // Merge data in .json files in directories with data in each file
  eleventyConfig.setDataDeepMerge(true);

  // Shortcodes/Helpers:

  // eleventyConfig.addShortcode("eq", generalHelpers.eq);
  // eleventyConfig.addShortcode("or", generalHelpers.or);
  // eleventyConfig.addShortcode("not", generalHelpers.not);


  return {
    dir: {
      input: "build",
      output: "dist",
    },
    templateFormats: [
      "html",
      "md",
      "css",
      "js",
      "hbs",
      "njk",
      "gif",
      "jpg",
      "jpeg",
      "png",
      "mp3",
      "mp4",
      "pdf",
      "ico",
    ],
  };
};
