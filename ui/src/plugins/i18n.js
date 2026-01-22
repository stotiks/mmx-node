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
const quasarLanguagePacks = import.meta.glob("../../node_modules/quasar/lang/(en-US|id|de|es|nl|pt|ru|uk|zh-CN).js", {
    import: "default",
});

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

/**
 * Loads and sets the i18n language asynchronously
 * @param {string|import('vue').Ref<string>} _locale - Locale to load (can be a Vue ref)
 */
export const loadAndSetI18nLanguageAsync = async (_locale) => {
    const locale = validateLocale(_locale);

    // Load Quasar language pack
    try {
        const lang = await quasarLanguagePacks[`../../node_modules/quasar/lang/${locale}.js`]();
        Lang.set(lang);
    } catch (err) {
        console.warn(`Failed to load Quasar language pack for "${locale}", falling back to en-US`, err);
        Lang.set(defaultQuasarLanguagePack);
    }

    const setLocaleAndMessages = (locale, messages) => {
        i18n.global.setLocaleMessage(locale, {});
        i18n.global.mergeLocaleMessage(locale, messages);
        i18n.global.mergeLocaleMessage(locale, commonMessages);

        i18n.global.locale.value = locale;
        document.querySelector("html").setAttribute("lang", locale);
    };

    // Load locale messages
    try {
        const messages = await locales[`/src/locales/${locale}.json`]();
        setLocaleAndMessages(locale, messages);
    } catch (err) {
        console.warn(`Failed to load messages for "${locale}", falling back to ${defaultLocale}`, err);
        setLocaleAndMessages(defaultLocale, defaultMessages);
    }
};

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
