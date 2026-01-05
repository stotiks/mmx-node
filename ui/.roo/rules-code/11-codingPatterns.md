# Coding Patterns *Optional*

This file documents recurring coding patterns and standards used in the project.
It is optional, but recommended to be updated as the project evolves.
2025-06-12 18:45:06 - Log of updates made.

*

## Coding Patterns

## JavaScript Style

*   Prefer arrow functions

## Code Refactoring

*   When refactoring or rewriting code, avoid deleting useful comments that explain complex logic, the reasoning behind a specific implementation, or other important context.

## UI Patterns

*   Use `@mdi/js` for icons.

## Internationalization (i18n) Patterns
read the file: `.roo/optional/i18n-patterns.md`

## Auto-imports

The following are auto-imported across the application via `unplugin-auto-import`.

### From libraries:
*   `vue`: all exports
*   `vue-i18n`: `useI18n`
*   `vue-router`: `useRoute`, `useRouter`
*   `@vueuse/core`: `computedAsync`
*   `pinia`: `storeToRefs`
*   `quasar`: `useQuasar`

### From directories:
*   `src/utils/**/*`
*   `src/composables/**/*`
*   `src/stores/**/*`

## Package Manager

*   Use `bun` instead of `npm` for package management.

## Testing Patterns

*   Use [`vitest`](https://vitest.dev/) for unit testing
*   Test files should use [`.test.js`](src/mmx/wallet/ECDSA_Wallet.js.test.js) extension and be placed adjacent to source files
*   Use `happy-dom` environment for Vue component tests.
*   When testing components that use Quasar UI components, stub the Quasar components (e.g., `q-select`) in the test setup to avoid complexity and warnings. Define the props in the stub to prevent Vue warnings about invalid props.
*   Run tests using `bun run test`. To run a specific test file, use `bun run test [path/to/file]`.

*   **Import Structure**: Always import `{ describe, it, expect }` from `"vitest"` at the top of test files. Import `vi` when mocking is needed.
*   **Test Organization**: Use nested `describe` blocks to group related tests logically:
    *   Top-level `describe` for the module/file being tested
    *   Nested `describe` blocks for individual functions or methods
    *   Individual `it` blocks for specific test cases

