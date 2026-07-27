module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'documentation/css': 'css' });
  eleventyConfig.addPassthroughCopy({ 'documentation/js': 'js' });
  eleventyConfig.addPassthroughCopy({ 'documentation/screenshots': 'screenshots' });

  return {
    dir: {
      input: '.',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
};
