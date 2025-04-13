import { defineStore, acceptHMRUpdate } from "pinia";

import { internalMessenger } from "@bex/messaging/popup";
const sendMessageAsync = async (payload) => await internalMessenger.sendMessage("notification", payload);

export const useVaultStore = defineStore("vault", () => {
    // State
    const isLocked = ref(true);
    const wallets = ref([]);

    // Actions
    const checkIsLocked = async () => {
        isLocked.value = await sendMessageAsync({ method: "isLocked" });
    };

    const lockAsync = async () => {
        isLocked.value = await sendMessageAsync({ method: "lockVault" });
    };

    const unlockAsync = async (password) => {
        isLocked.value = await sendMessageAsync({
            method: "unlockVault",
            params: { password },
        });

        if (!isLocked.value) {
            await getWallets();
        }
    };

    const updatePasswordAsync = async (password, newPassword) => {
        await sendMessageAsync({
            method: "updatePassword",
            params: { password, newPassword },
        });
    };

    const getWallets = async () => {
        wallets.value = await sendMessageAsync({ method: "getWallets" });
    };

    //Initialize
    (async () => {
        await checkIsLocked();
        if (!isLocked.value) {
            await getWallets();
        }
    })();

    return {
        // State
        isLocked,
        wallets,
        // Actions
        lockAsync,
        unlockAsync,
        updatePasswordAsync,
        getWallets,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useNodeStore, import.meta.hot));
}
