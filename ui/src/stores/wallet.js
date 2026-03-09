import { defineStore, acceptHMRUpdate } from "pinia";

export const useWalletStore = defineStore("wallet", () => {
    // shallowRef prevents deep reactive wrapping of the wallet object.
    // markRaw (applied on set) ensures Vue never traverses wallet internals,
    // keeping private key material (#seed_value, #passphrase, #keysCache)
    // invisible to Vue Devtools.
    const wallet = shallowRef(null);

    const setWallet = (walletInstance) => {
        // Destroy any existing wallet before replacing
        wallet.value?.destroy?.();
        wallet.value = walletInstance ? markRaw(walletInstance) : null;
    };

    const clearWallet = () => {
        wallet.value?.destroy?.();
        wallet.value = null;
    };

    const doLogout = () => {
        clearWallet();
    };

    return {
        wallet,
        setWallet,
        clearWallet,
        doLogout,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useWalletStore, import.meta.hot));
}
