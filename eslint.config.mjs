import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'documentation/_site/**', 'test/integration/html/**']
  },
  js.configs.recommended,
  {
    languageOptions: {
      sourceType: 'script',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jquery,
        define: 'readonly'
      }
    },
    rules: {
      // Several intentional try/catch-and-ignore blocks (old-browser
      // workarounds) don't reference the caught error.
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      sourceType: 'module'
    }
  },
  {
    files: ['test/unit/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.qunit
      }
    }
  },
  {
    files: ['test/specs/**/*.js', 'test/support/**/*.js'],
    languageOptions: {
      globals: {
        test: 'off',
        expect: 'off'
      }
    }
  }
];
