import { defineStore, acceptHMRUpdate } from "pinia";

import { internalMessenger } from "@bex/messaging/popup";
const sendMessage = async (payload) => await internalMessenger.sendMessage("notification", payload);

export const useVaultStore = defineStore("vault", () => {
    // State
    const isLocked = ref(true);
    const accounts = ref([]);

    // Actions
    const checkIsLocked = async () => {
        isLocked.value = await sendMessage({ method: "isLocked" });
    };

    const lockAsync = async () => {
        isLocked.value = await sendMessage({ method: "lockVault" });
    };

    const unlockAsync = async (password) => {
        isLocked.value = await sendMessage({
            method: "unlockVault",
            params: { password },
        });

        if (!isLocked.value) {
            await getWalletsAddresses();
        }
    };

    const updatePasswordAsync = async (password, newPassword) => {
        await sendMessage({
            method: "updatePassword",
            params: { password, newPassword },
        });
    };

    const getWalletsAddresses = async () => {
        accounts.value = await sendMessage({ method: "getWalletsAddresses" });
    };

    //Initialize async
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
