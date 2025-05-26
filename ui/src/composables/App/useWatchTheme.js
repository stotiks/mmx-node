export const useWatchTheme = (pollInterval = 500) => {
    const $q = useQuasar();
    const appStore = useAppStore();
    let interval;

    watchEffect(() => $q.dark.set(appStore.isDarkTheme));

    if (window.mmx?.theme_dark !== undefined && !interval) {
        interval = setInterval(() => {
            appStore.isDarkTheme = window.mmx.theme_dark;
        }, pollInterval);
    }

    onUnmounted(() => {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    });
};
