module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        jquery: true
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: 'standard',
    // add your custom rules here
    rules: {
        'indent': [2, 4, {'SwitchCase': 1}],
        'no-extra-semi': 0,
        'semi': 0,
        // allow paren-less arrow functions
        'arrow-parens': 0,
        'no-cond-assign': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        // allow console during development
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
        // require or disallow a space before function parenthesis
        'space-before-function-paren': ['error', {
            'anonymous': 'always',
            'named': 'never',
            'asyncArrow': 'never'
        }]
    }
};
