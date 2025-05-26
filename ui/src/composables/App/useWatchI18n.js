import i18n, { loadAndSetI18nLanguageAsync } from "@/plugins/i18n";
import { nextTick } from "vue";

export const useWatchI18n = (pollInterval = 500) => {
    const appStore = useAppStore();
    let interval;

    const setLocale = async (locale) => {
        try {
            await loadAndSetI18nLanguageAsync(i18n, locale);
            return nextTick();
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
