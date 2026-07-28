# Contributing to the documentation

The docs/demo site is built with [Eleventy](https://www.11ty.dev/).

- `npm run docs:build` — build the public site into `documentation/_site/`
- `npm run docs:preview` — build and serve locally with live reload
- `npm run test:fixtures` — regenerate the versioned Playwright test fixtures into `test/integration/html/`

Content lives in `documentation/*.md`, `documentation/docs/*.md`, and `documentation/demo/*.md`. Demo pages under `demo/` double as acceptance-test fixtures — don't remove the `.showcase`/`data-showcase-import` markup or the actual `$.contextMenu(...)` calls, Playwright interacts with them directly.
