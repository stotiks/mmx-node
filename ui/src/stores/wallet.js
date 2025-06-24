import { defineStore, acceptHMRUpdate } from "pinia";

export const useWalletStore = defineStore("wallet", () => {
    const wallet = ref(null);

    const doLogout = () => {
        wallet.value = null;
    };

    return {
        wallet,
        doLogout,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useWalletStore, import.meta.hot));
}
