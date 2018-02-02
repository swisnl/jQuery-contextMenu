# Generate documentation

To generate documentation install couscous and run in this folder. Use ```couscous preview``` to run local server with the documentation.

http://couscous.io/docs/getting-started.html

The generated html will also be copied to the tests/integration/html folder for integration tests.

# Building

Checkout the repository 

`$ git clone https://github.com/swisnl/jQuery-contextMenu`

Install dependencies with yarn 

`$ yarn`

Run webpack to build the dist code.

`$ yarn run webpack`

You can also watch for changes and build accordingly with the `webpack-watch` command

`$ yarn run webpack-watch`

# Running tests

You can run tests locally by using the `yarn test` command. This will also generage coverage in `./coverage/`.

# Writing tests

Please write tests for your pull requests. You can check out how to write tests by checking out the `./tests/unit/contextmenu.test.js` file.

[Karma testrunner](https://karma-runner.github.io/2.0/index.html) - Testrunner.
[QUnit](https://qunitjs.com/) - Testing framework.
[Sinon.js](http://sinonjs.org/) - Standalone test spies, stubs and mocks for JavaScript. 
