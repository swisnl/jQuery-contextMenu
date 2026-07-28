const markdownItAnchor = require('markdown-it-anchor');

// Matches doctoc's own github.com slug mode (anchor-markdown-header's
// basicGithubId), so the TOC links doctoc generates actually resolve.
function githubSlugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/%([abcdef]|\d){2,2}/gi, '')
    .replace(/[\/\\?!%:[\]`.,()*"';{}+=<>~$|#@&–—]/g, '');
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'documentation/css': 'css' });
  eleventyConfig.addPassthroughCopy({ 'documentation/js': 'js' });
  eleventyConfig.addPassthroughCopy({ 'documentation/screenshots': 'screenshots' });
  // Lets a local build serve its own dist/ so SITE_BASE_URL can point demo
  // pages at it instead of the live production bundle (see eleventyComputed.js).
  eleventyConfig.addPassthroughCopy({ dist: 'dist' });

  eleventyConfig.amendLibrary('md', (mdLib) =>
    mdLib.use(markdownItAnchor, { slugify: githubSlugify, tabIndex: false })
  );

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
