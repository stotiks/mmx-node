import { createI18n } from "vue-i18n";
import commonMessages from "@/locales/common.json";
import enMessages from "@/locales/en-US.json";
import { default as enQLocale } from "/node_modules/quasar/lang/en-US.js";

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

export const defaultLocale = availableLanguages[0].value;

// const availableLanguagesList = availableLanguages.map((item) => item.value);
// console.log(availableLanguagesList.join("|"));

// https://quasar.dev/options/quasar-language-packs/#dynamical-non-ssr-
import { Lang } from "quasar";
const quasarLanguagePacks = import.meta.glob("/node_modules/quasar/lang/(id|de|es|nl|pt|ru|uk|zh-CN).js", {
    import: "default",
});

const locales = import.meta.glob("@/locales/(id|de|es|nl|pt|ru|uk|zh-CN).json");

const setI18nLanguage = (i18n, locale) => {
    if (i18n.mode === "legacy") {
        i18n.global.locale = locale;
    } else {
        i18n.global.locale.value = locale;
    }
    /**
     * NOTE:
     * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
     * The following is an example for axios.
     *
     * axios.defaults.headers.common['Accept-Language'] = locale
     */
    document.querySelector("html").setAttribute("lang", locale);
};

export const loadAndSetI18nLanguageAsync = async (i18n, _locale) => {
    const locale = toValue(validateLocale(_locale));
    try {
        const lang = await quasarLanguagePacks[`/node_modules/quasar/lang/${locale}.js`]();
        Lang.set(lang);
    } catch (err) {
        Lang.set(enQLocale);
    }

    const setLocaleAndMessages = (locale, messages) => {
        i18n.global.setLocaleMessage(locale, mergeDeep({}, commonMessages, messages));
        setI18nLanguage(i18n, locale);
    };

    try {
        const messages = await locales[`/src/locales/${locale}.json`]();
        setLocaleAndMessages(locale, messages);
    } catch (err) {
        setLocaleAndMessages(defaultLocale, enMessages);
    }
};

export const validateLocale = (locale) => {
    if (availableLanguages.some((language) => language.value == toValue(locale))) {
        return locale;
    } else {
        return defaultLocale;
    }
};

const isObject = (item) => {
    return item && typeof item === "object" && !Array.isArray(item);
};

const mergeDeep = (target, ...sources) => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, {
                        [key]: {},
                    });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, {
                    [key]: source[key],
                });
            }
        }
    }

    return mergeDeep(target, ...sources);
};

const i18n = createI18n({
    globalInjection: true,
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: defaultLocale,
    messages: {
        "en-US": mergeDeep({}, commonMessages, enMessages),
    },
});

export default i18n;
