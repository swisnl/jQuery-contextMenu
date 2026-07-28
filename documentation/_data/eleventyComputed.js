// Default for public-site (non-fixture) builds: the live GitHub Pages URL,
// so an unset SITE_BASE_URL (e.g. in the docs:build CI step) reproduces
// today's behavior exactly. Override with SITE_BASE_URL='' (see docs:preview
// in package.json) to serve dist/ from the local build output instead of
// production — lets `npm run docs:preview` exercise a dist/ change before
// it's deployed, and lets anyone hosting this site elsewhere point at their
// own URL instead.
const DEFAULT_SITE_BASE_URL = 'https://swisnl.github.io/jQuery-contextMenu';

function resolvedSiteBaseUrl() {
  return process.env.SITE_BASE_URL !== undefined ? process.env.SITE_BASE_URL : DEFAULT_SITE_BASE_URL;
}

// GitHub Pages serves this project off /jQuery-contextMenu/, not the domain
// root (there's no CNAME) -- so site-relative links need that path segment,
// not just a leading slash. Derived from the same base URL as assetBase
// rather than hardcoded, so it stays correct if the site ever moves.
function sitePathPrefix() {
  const base = resolvedSiteBaseUrl();
  if (!base) return '';
  try {
    return new URL(base).pathname.replace(/\/$/, '');
  } catch {
    return base.replace(/\/$/, '');
  }
}

module.exports = {
  // ELEVENTY_FIXTURES=1 (set by the `test:fixtures` npm script) switches
  // demo pages from "public site" mode (SITE_BASE_URL asset URLs) to
  // "local fixture" mode (relative src/dist paths in the checkout, so
  // Playwright exercises the actual code under test).
  isFixtureBuild: () => process.env.ELEVENTY_FIXTURES === '1',
  assetBase: (data) => (data.isFixtureBuild ? '' : resolvedSiteBaseUrl()),

  // Demo page assets: site.css/showcase.js are passthrough-copied one level
  // up from the fixture output root (test/integration/html/jquery-<version>/),
  // so fixture mode needs a relative site base while prod serves them from
  // the site root. dist/src assets aren't copied into the fixture tree at
  // all, so fixture mode reaches back into the checkout (demo pages always
  // land at jquery-<version>/<slug>.html, hence the fixed 4-level ../../../..)
  // and deliberately loads the raw src/ files rather than the built dist/
  // bundle, so Playwright exercises the actual source under test.
  siteAssetBase: (data) => (data.isFixtureBuild ? '..' : sitePathPrefix()),
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
