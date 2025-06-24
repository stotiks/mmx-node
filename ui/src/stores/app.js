import { defaultLocale } from "@/plugins/i18n";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useAppStore = defineStore("app", () => {
    const isDarkTheme = useLocalStorage("isDarkTheme", true);
    const locale = useLocalStorage("locale", defaultLocale);
    const _wapiBaseUrl = useLocalStorage("wapiBaseUrl", null);

    const _isWinGUI = ref(typeof window.mmx !== "undefined");
    const _isQtGUI = ref(typeof window.mmx_qtgui !== "undefined");

    const isWinGUI = computed(() => _isWinGUI.value);
    const isQtGUI = computed(() => _isQtGUI.value);
    const isGUI = computed(() => isWinGUI.value || isQtGUI.value);

    const wapiBaseUrl = computed(() => {
        // eslint-disable-next-line no-undef
        if (typeof __ALLOW_CUSTOM_RPC__ !== "undefined" && __ALLOW_CUSTOM_RPC__ === true) {
            if (!isEmpty(_wapiBaseUrl.value)) {
                return _wapiBaseUrl.value;
            }
        }

        if (typeof __WAPI_URL__ !== "undefined") {
            // eslint-disable-next-line no-undef
            return __WAPI_URL__;
        }

        return null;
    });

    return {
        isDarkTheme,
        locale,
        _wapiBaseUrl,
        isWinGUI,
        isQtGUI,
        isGUI,
        wapiBaseUrl,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
