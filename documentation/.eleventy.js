module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'documentation/css': 'css' });
  eleventyConfig.addPassthroughCopy({ 'documentation/js': 'js' });
  eleventyConfig.addPassthroughCopy({ 'documentation/screenshots': 'screenshots' });
  // Lets a local build serve its own dist/ so SITE_BASE_URL can point demo
  // pages at it instead of the live production bundle (see eleventyComputed.js).
  eleventyConfig.addPassthroughCopy({ dist: 'dist' });

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
