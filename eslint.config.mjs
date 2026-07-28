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
        ...globals.qunit,
        define: 'readonly'
      }
    }
  }
];
