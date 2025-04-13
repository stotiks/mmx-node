import { defineStore, acceptHMRUpdate } from "pinia";

import { internalMessenger } from "@bex/messaging/popup";
const sendMessageAsync = async (payload) => await internalMessenger.sendMessage("notification", payload);

export const useVaultStore = defineStore("vault", () => {
    // State
    const isLocked = ref(true);
    const accounts = ref([]);

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
            await getWalletsAddresses();
        }
    };

    const updatePasswordAsync = async (password, newPassword) => {
        await sendMessageAsync({
            method: "updatePassword",
            params: { password, newPassword },
        });
    };

    const getWalletsAddresses = async () => {
        accounts.value = await sendMessageAsync({ method: "getWalletsAddresses" });
    };

    //Initialize
    (async () => {
        await checkIsLocked();
        if (!isLocked.value) {
            await getWalletsAddresses();
        }
    })();

    return {
        // State
        isLocked,
        accounts,
        // Actions
        lockAsync,
        unlockAsync,
        updatePasswordAsync,
        getWalletsAddresses,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useNodeStore, import.meta.hot));
}
