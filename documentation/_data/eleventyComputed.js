module.exports = {
  // ELEVENTY_FIXTURES=1 (set by the `test:fixtures` npm script) switches
  // demo pages from "public site" mode (live GitHub Pages asset URLs) to
  // "local fixture" mode (relative src/dist paths in the checkout, so
  // Playwright exercises the actual code under test).
  isFixtureBuild: () => process.env.ELEVENTY_FIXTURES === '1',
  assetBase: (data) => (data.isFixtureBuild ? '' : 'https://swisnl.github.io/jQuery-contextMenu'),

  // Preserve the existing "name.html" URL scheme (matches the live,
  // externally-linked/indexed Couscous-era site) instead of Eleventy's
  // default "name/index.html" pretty-URLs.
  //
  // Demo pages (documentation/demo/*.md) are paginated per jQuery version
  // via demo/demo.11tydata.js — `data.pagination` is only present for
  // those, so it's a reliable "is this a demo page" signal. In fixture
  // mode each version gets its own file under test/integration/html/; in
  // public-site mode paginationVersions has exactly one entry, so this
  // still collapses to a single demo/<slug>.html per demo.
  // Note: paths here are relative to whatever --output dir the build was
  // invoked with (documentation/_site for the public site, test/integration/html
  // for fixtures) -- NOT relative to the repo root.
  permalink: (data) => {
    if (data.pagination) {
      if (data.isFixtureBuild) {
        return `jquery-${data.jqueryVersion}/${data.page.fileSlug}.html`;
      }
      return `demo/${data.page.fileSlug}.html`;
    }
    return data.page.filePathStem + '.html';
  },
};
