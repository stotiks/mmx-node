import { createI18n } from "vue-i18n";
import { Lang } from "quasar";
import commonMessages from "@/locales/common.json";

export const defaultLocale = "en-US";
import defaultMessages from "@/locales/en-US.json";
import defaultQuasarLanguagePack from "quasar/lang/en-US.js";

export const availableLanguages = [
    { value: "en-US", label: "English" },
    { value: "id", label: "Bahasa Indonesia" },
    { value: "de", label: "Deutsch" },
    { value: "es", label: "Español" },
    { value: "nl", label: "Nederlands" },
    { value: "pt", label: "Português" },
    { value: "ru", label: "Русский" },
    { value: "uk", label: "Українська" },
    { value: "zh-CN", label: "简体中文" },
];

const locales = import.meta.glob("@/locales/(en-US|id|de|es|nl|pt|ru|uk|zh-CN).json");

// https://quasar.dev/options/quasar-language-packs/#dynamical-non-ssr-
const quasarLanguagePacks = import.meta.glob("../../node_modules/quasar/lang/(en-US|id|de|es|nl|pt|ru|uk|zh-CN).js");

const setupI18n = () => {
    const i18n = createI18n({
        globalInjection: true,
        legacy: false,
        locale: defaultLocale,
        fallbackLocale: defaultLocale,
        messages: {
            [defaultLocale]: { ...defaultMessages },
        },
    });

    i18n.global.mergeLocaleMessage(defaultLocale, commonMessages);

    return i18n;
};

const i18n = setupI18n();

export async function setI18nLanguage(_locale) {
    const locale = validateLocale(_locale);
    if (i18n.global.locale.value === locale) return;

    // If messages for this locale aren't loaded yet → load them
    if (!i18n.global.availableLocales.includes(locale)) {
        await loadLocaleMessages(locale);
    }

    i18n.global.locale.value = locale;

    // Load Quasar language pack
    await loadAndSetQuasarLanguagePack(locale);

    // Optional: reflect in <html lang="...">
    document.querySelector("html")?.setAttribute("lang", locale);

    // Wait for Vue reactivity / template re-render
    await nextTick();
}

async function loadAndSetQuasarLanguagePack(locale) {
    try {
        const lang = await quasarLanguagePacks[`../../node_modules/quasar/lang/${locale}.js`]();
        Lang.set(lang.default ?? lang);
    } catch (err) {
        console.warn(`Failed to load Quasar language pack for "${locale}", falling back to default`, err);
        Lang.set(defaultQuasarLanguagePack);
    }
}

// Actually loads the JSON (or js/ts) file — uses Vite/Webpack dynamic import
async function loadLocaleMessages(locale) {
    // Dynamic import → creates separate chunk per language
    const messages = await locales[`/src/locales/${locale}.json`]();

    // Register the messages
    i18n.global.setLocaleMessage(locale, messages.default ?? messages);
    i18n.global.mergeLocaleMessage(locale, commonMessages.default ?? commonMessages);

    // Optional: if you have number/date formats per locale
    // i18n.global.setNumberFormat(locale, { ... })
    // i18n.global.setDateTimeFormat(locale, { ... })
}

/**
 * Validates and normalizes a locale value
 * @param {string|import('vue').Ref<string>} _locale - Locale to validate (can be a Vue ref)
 * @returns {string} Validated locale or defaultLocale if invalid
 */
export const validateLocale = (_locale) => {
    const locale = toValue(_locale);
    if (availableLanguages.some((language) => language.value === locale)) {
        return locale;
    } else {
        if (locale !== defaultLocale) {
            console.warn(`Invalid locale "${locale}", falling back to ${defaultLocale}`);
        }
        return defaultLocale;
    }
};

export default i18n;
