// Pinned exact versions tested by both the unit-test CI matrix and the
// acceptance-test fixtures. Bump deliberately, not automatically.
const showcase = '4.0.0'; // version used on the public demo site
const tested = ['1.12.4', '2.2.4', '3.7.1', '4.0.0']; // versions the Playwright fixtures are generated for

module.exports = {
  showcase,
  tested,
  // Drives demo-page pagination (see demo/demo.11tydata.js): one version
  // in public-site mode (a single canonical page per demo), all tested
  // versions in fixture mode (ELEVENTY_FIXTURES=1) so pagination naturally
  // produces the right file count for either build.
  paginationVersions: process.env.ELEVENTY_FIXTURES === '1' ? tested : [showcase],
};
