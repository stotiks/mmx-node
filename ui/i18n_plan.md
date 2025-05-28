# Internationalization Plan for `src/` Directory

**Goal:**
To replace all user-facing hardcoded strings in `.vue` files within the `src/` directory with `vue-i18n` translation keys, ensuring they are loaded from locale files. The primary focus will be on setting up the English (`en-US`) translations correctly.

**Existing Setup:**

- **Technology:** `vue-i18n` is used, configured in `src/plugins/i18n.js`.
- **Locale Files:** Located in `src/locales/`, with `en-US.json` as the primary English file and `common.json` for shared/linked translations.
- **Key Structure:** Keys are generally grouped by component or feature (e.g., `main_menu`, `account_send_form`).
- **Usage:** `$t('key.name')` in templates and `i18n.global.t('key.name')` in scripts.

**Detailed Steps:**

1.  **Refine String Identification:**

    - Carefully review the output from automated string searches to filter out any false positives (e.g., CSS class names, internal variables that shouldn't be translated).
    - Manually inspect `.vue` files within the `src/` directory, particularly in `<script>` sections, for any hardcoded user-facing strings that automated searches might have missed (e.g., strings used in notifications, alerts, or dynamic messages).

2.  **Translation Key Naming and Structure:**

    - **Principle:** Follow the existing convention. Keys should be semantic, in `snake_case`, and grouped logically by component or feature.
        - Example: For a "User Profile" page, keys might be `user_profile.title`, `user_profile.edit_button`, `user_profile.save_changes_label`.
    - **New Groups:** If a component or feature doesn't have an existing group in `src/locales/en-US.json`, create a new top-level JSON object for it.
        - Example: If internationalizing `src/components/NewFeature.vue`, you might add a `new_feature: { ... }` block to `src/locales/en-US.json`.
    - **Common Strings:**
        - If a string is generic and likely to be reused across multiple, unrelated parts of the application (e.g., "Save", "Cancel", "Error", "Loading..."), add it to the `common` object within `src/locales/en-US.json`.
        - If this common string is then used as a base for many other sections (as seen in `src/locales/common.json`), you can add a linked message in `src/locales/common.json` (e.g., `"my_section_save_button": "@:common.save"`). For direct use of truly common terms, just use `common.your_key`.

3.  **Updating Locale Files:**

    - **English (`src/locales/en-US.json`):** Add all new English strings here, under their respective groups. This will be the source of truth for English text.
    - **Template (`src/locales/template._json`):** Mirror the structure and keys from `src/locales/en-US.json` into this file. The English text can serve as the initial value, which translators will then replace for other languages. This keeps the template up-to-date for future translation efforts.
    - **Other Languages (e.g., `de.json`, `es.json`):** (This is a subsequent step, not part of the immediate implementation of English keys). These files would eventually be updated by translators using the new keys from the template or `src/locales/en-US.json`.

4.  **Replacing Hardcoded Strings in `.vue` Files:**

    - **In Templates (`<template>`):**
        - For text content: `<div>My hardcoded text</div>` becomes `<div>{{ $t('your_group.your_key') }}</div>`
        - For attributes: `<q-input label="Hardcoded Label" />` becomes `<q-input :label="$t('your_group.label_key')" />`
    - **In Scripts (`<script setup>` or Options API):**
        - Import `i18n` if needed: `import i18n from '@/plugins/i18n';` (though global injection might make it available as `this.$i18n` or via `useI18n` composable).
        - Usage: `const message = 'Hardcoded error';` becomes `const message = i18n.global.t('errors.some_specific_error');`
        - Or, if using the composable: `const { t } = useI18n(); const message = t('errors.some_specific_error');`

5.  **Handling Dynamic Content (Interpolation & Pluralization):**

    - **Interpolation:** For strings with dynamic values (e.g., "Welcome, {name}!").
        - In `src/locales/en-US.json`: `"welcome_user": "Welcome, {name}!"`
        - In template: `{{ $t('user.welcome_user', { name: userName }) }}`
    - **Pluralization:** For strings that change based on a count (e.g., "1 apple" / "{count} apples").
        - In `src/locales/en-US.json`: `"apple_count": "1 apple | {count} apples"`
        - In template: `{{ $t('product.apple_count', { count: numberOfApples }) }}`

6.  **Iterative Workflow:**

    - Select a manageable scope, such as a single component or a small group of related components.
    - For the selected scope:
        1.  Identify all hardcoded strings.
        2.  Define appropriate translation keys following the naming conventions.
        3.  Add these keys and their English translations to `src/locales/en-US.json`.
        4.  Add the new keys (with English text) to `src/locales/template._json`.
        5.  Replace the hardcoded strings in the `.vue` file(s) with the corresponding `$t()` calls.
        6.  Run the application locally and thoroughly test the modified component(s) to ensure the English strings are displayed correctly from the locale file and that there are no console errors related to i18n.
    - Repeat this process iteratively until all identified hardcoded strings in the `src/` directory are internationalized.

7.  **Final Testing and Verification:**
    - Once all strings are processed, conduct a full application walkthrough:
        - Verify that all previously hardcoded strings now display the correct English text loaded via `vue-i18n`.
        - Check the browser console for any warnings or errors related to missing translations or i18n misconfiguration.
        - (Optional but Recommended) If other language files (`de.json`, `es.json`, etc.) are partially translated, switch the application's language to one of them. For the newly added keys, it should fall back to English or show the key itself. This helps confirm the i18n mechanism is working for the new keys.

**Visual Workflow:**

```mermaid
graph TD
    A[Start: Task to i18n src/] --> B{Identify Hardcoded Strings};
    B -- Automated Scan --> C[Review Scan Results];
    B -- Manual Inspection --> C;
    C --> D[Define Translation Keys];
    D --> E[Update Locale Files: en-US.json & template._json];
    E --> F[Replace Strings in .vue Files with $t()];
    F --> G{Handle Dynamic Content?};
    G -- Yes --> H[Implement Interpolation/Pluralization];
    H --> I[Test Component/Scope];
    G -- No --> I;
    I -- More Strings? --> B;
    I -- All Strings Done --> J[Full Application Test & Verification];
    J --> K[End: i18n for English Complete];
```
