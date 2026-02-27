import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      // Strict errors
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      'no-restricted-syntax': ['error', 'SequenceExpression'],
      '@typescript-eslint/no-namespace': 'error',
      'no-param-reassign': 'error',
      '@typescript-eslint/triple-slash-reference': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      'no-labels': 'error',
      'no-cond-assign': 'error',
      'no-new-wrappers': 'error',
      'constructor-super': 'error',
      'no-duplicate-case': 'error',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-duplicate-imports': 'error',

      // Warnings
      '@typescript-eslint/no-empty-interface': 'warn',
      'no-var': 'warn',
      eqeqeq: 'warn',
      'prefer-for-of': 'warn',
      'prefer-const': 'warn'
    }
  },
  {
    ignores: ['build/**', 'node_modules/**', 'functions/**']
  }
]
