import { defineStore, acceptHMRUpdate } from "pinia";

import { internalMessenger } from "@bex/messaging/popup";
const sendMessageAsync = async (payload) => {
    const { success, data, error } = await internalMessenger.sendMessage("notification", payload);

    if (success) {
        return data;
    } else {
        throw new Error(error || "Unknown error occurred");
    }
};

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

    const addWalletAsync = async (seed, password) => {
        await sendMessageAsync({
            method: "addWallet",
            params: { seed, password },
        });
        await getWallets();
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
        addWalletAsync,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useVaultStore, import.meta.hot));
}
