module.exports = {
  // ELEVENTY_FIXTURES=1 (set by the `test:fixtures` npm script) switches
  // demo pages from "public site" mode (live GitHub Pages asset URLs) to
  // "local fixture" mode (relative src/dist paths in the checkout, so
  // Playwright exercises the actual code under test).
  isFixtureBuild: () => process.env.ELEVENTY_FIXTURES === '1',
  assetBase: (data) => (data.isFixtureBuild ? '' : 'https://swisnl.github.io/jQuery-contextMenu'),

  // Demo page assets: site.css/showcase.js are passthrough-copied one level
  // up from the fixture output root (test/integration/html/jquery-<version>/),
  // so fixture mode needs a relative site base while prod serves them from
  // the site root. dist/src assets aren't copied into the fixture tree at
  // all, so fixture mode reaches back into the checkout (demo pages always
  // land at jquery-<version>/<slug>.html, hence the fixed 4-level ../../../..)
  // and deliberately loads the raw src/ files rather than the built dist/
  // bundle, so Playwright exercises the actual source under test.
  siteAssetBase: (data) => (data.isFixtureBuild ? '..' : ''),
  contextMenuCssHref: (data) => (data.isFixtureBuild
    ? '../../../../dist/jquery.contextMenu.css'
    : `${data.assetBase}/dist/jquery.contextMenu.css`),
  positionScriptSrc: (data) => (data.isFixtureBuild
    ? '../../../../src/jquery.ui.position.js'
    : `${data.assetBase}/dist/jquery.ui.position.min.js`),
  contextMenuScriptSrc: (data) => (data.isFixtureBuild
    ? '../../../../src/jquery.contextMenu.js'
    : `${data.assetBase}/dist/jquery.contextMenu.js`),

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
