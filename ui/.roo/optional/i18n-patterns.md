# Internationalization (i18n) Patterns

### Overview

The project uses `vue-i18n` for internationalization. This allows the application to be translated into multiple languages.

### Configuration

The main i18n configuration is located in [`src/plugins/i18n.js`](src/plugins/i18n.js). This file initializes `vue-i18n`, defines the available languages, and handles the dynamic loading of language files.

### File Structure

All translation files are located in the [`src/locales`](src/locales) directory.

*   [`common.json`](src/locales/common.json): Contains translations for terms that are shared across multiple components and pages. This helps to avoid duplication.
*   `[language-code].json` (e.g., [`en-US.json`](src/locales/en-US.json), [`de.json`](src/locales/de.json)): Contains translations for a specific language. These files are merged with [`common.json`](src/locales/common.json).

### Usage Guide

#### In Vue Templates

Use the `$t()` function to access translations in Vue templates.

```html
<template>
  <h1>{{ $t('main_menu.explore') }}</h1>
</template>
```

#### In Vue `<script setup>`

Use the `useI18n` composable to get the `t` function.

```javascript
<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const title = t('main_menu.explore');
</script>
```

#### In JavaScript Modules

Import the `i18n` instance and use `i18n.global.t()`.

```javascript
import i18n from '@/plugins/i18n';

const message = i18n.global.t('my_translation_key');
```

### Adding Translations

1.  **Identify the correct file**:
    *   If the term is shared, add it to [`src/locales/common.json`](src/locales/common.json).
    *   Otherwise, add it to [`src/locales/en-US.json`](src/locales/en-US.json).
2.  **Add the key and value**:
    ```json
    {
      "my_new_key": "My new translation"
    }
    ```
3.  **Translate the key** in all other language files (e.g., [`de.json`](src/locales/de.json)).
4.  **Use the key** in your code.

### Adding a New Language

1.  Add the language to the `availableLanguages` array in [`src/plugins/i18n.js`](src/plugins/i18n.js).
2.  Create a new language file in [`src/locales`](src/locales) (e.g., `fr.json`).
3.  Copy the contents of [`en-US.json`](src/locales/en-US.json) and translate the values.
4.  Add the new language to the Quasar language pack import in [`src/plugins/i18n.js`](src/plugins/i18n.js).

### Workflow Diagram

```mermaid
graph TD
    A[Developer needs a new translation] --> B{Is it a shared term?};
    B -->|Yes| C[Add key to src/locales/common.json];
    B -->|No| D[Add key to src/locales/en-US.json];
    C --> E{Translate in all language files};
    D --> E;
    E --> F[Use key in code, e.g., $t('new.key')];
    F --> G[UI displays translated string];