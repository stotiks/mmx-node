# Coding Patterns *Optional*

This file documents recurring coding patterns and standards used in the project.
It is optional, but recommended to be updated as the project evolves.
2025-06-12 18:45:06 - Log of updates made.

*

## Coding Patterns

## JavaScript Style

*   Prefer arrow functions

## UI Patterns

*   Use `@mdi/js` for icons.

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


## BEX Custom Store

*   The file [`src-bex/entrypoints/background/stores/vault.js`](src-bex/entrypoints/background/stores/vault.js) is a custom store for the browser extension's background script. Pinia cannot be used in this context, so it uses a custom singleton class for state management, storage, and events.
