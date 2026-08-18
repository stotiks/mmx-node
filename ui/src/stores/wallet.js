import { defineStore, acceptHMRUpdate } from "pinia";

export const useWalletStore = defineStore("wallet", () => {
    // shallowRef prevents deep reactive wrapping of the wallet object.
    // markRaw (applied on set) ensures Vue never traverses wallet internals,
    // keeping private key material (#seed_value, #passphrase, #keysCache)
    // invisible to Vue Devtools.
    const _wallet = shallowRef(null);

    const wallet = computed({
        get: () => _wallet.value,
        set: (walletInstance) => {
            clearWallet();
            _wallet.value = walletInstance ? markRaw(walletInstance) : null;
        },
    });

    const clearWallet = () => {
        _wallet.value?.destroy?.();
        _wallet.value = null;
    };

    const doLogout = () => {
        clearWallet();
    };

    // onUnmounted(() => {
    //     clearWallet();
    // });

    return {
        wallet,
        clearWallet,
        doLogout,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useWalletStore, import.meta.hot));
}
