import { setI18nLanguage } from "@/plugins/i18n";

export const useWatchI18n = (pollInterval = 500) => {
    const appStore = useAppStore();
    let interval;

    const setLocale = async (locale) => {
        try {
            await setI18nLanguage(locale);
        } catch (error) {
            console.error("Failed to set locale:", error);
        }
    };

    watchEffect(() => setLocale(appStore.locale));

    if (window.mmx?.locale !== undefined && !interval) {
        interval = setInterval(() => {
            appStore.locale = window.mmx.locale;
        }, pollInterval);
    }

    onUnmounted(() => {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    });
};
