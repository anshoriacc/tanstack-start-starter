//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    name: 'project/ignores',
    ignores: [
      '**/.nitro/**',
      '**/.output/**',
      '**/.tanstack/**',
      '**/.vinxi/**',
    ],
  },
  ...tanstackConfig,
  {
    files: ['**/*.{js,ts,tsx}'],
    rules: {
      // Disable type import separation - allow inline type imports
      'import/consistent-type-specifier-style': 'off',
      // Disable import order enforcement (no sorting)
      'import/order': 'off',
      // Change type imports to allow inline style
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
    },
  },
]
