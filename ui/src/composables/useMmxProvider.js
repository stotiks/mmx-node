import { useEventListener } from "@vueuse/core";

export const useMmxProvider = () => {
    const provider = shallowRef(null);

    useEventListener(window, "mmx:announceProvider", (event) => {
        console.log("📱 dApp: provider loaded");
        provider.value = event.detail.provider;
    });

    console.log("📱 dApp: request provider");
    window.dispatchEvent(new Event("mmx:requestProvider"));

    const isMmxProviderLoaded = computed(() => !!provider.value?.isFurryVault);
    const mmxProvider = computed(() => isMmxProviderLoaded.value && provider.value);

    return { isMmxProviderLoaded, mmxProvider };
};
