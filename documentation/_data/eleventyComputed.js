module.exports = {
  // Preserve the existing "name.html" URL scheme (matches the live,
  // externally-linked/indexed Couscous-era site) instead of Eleventy's
  // default "name/index.html" pretty-URLs. By the time eleventyComputed
  // runs, `data.permalink` is already populated with Eleventy's own
  // pretty-URL default (even when no front matter set one), so plain
  // undefined-checking can't detect "was this explicitly set by a page."
  // Pages that need custom multi-file output (paginated fixtures, Task 5)
  // opt out via `customPermalink` instead.
  permalink: (data) => {
    if (data.customPermalink !== undefined) {
      return data.customPermalink;
    }
    return data.page.filePathStem + '.html';
  },

  // ELEVENTY_FIXTURES=1 (set by the `test:fixtures` npm script) switches
  // demo pages from "public site" mode (live GitHub Pages asset URLs) to
  // "local fixture" mode (relative src/dist paths in the checkout, so
  // Playwright exercises the actual code under test).
  isFixtureBuild: () => process.env.ELEVENTY_FIXTURES === '1',
  assetBase: (data) => (data.isFixtureBuild ? '' : 'https://swisnl.github.io/jQuery-contextMenu'),
};
