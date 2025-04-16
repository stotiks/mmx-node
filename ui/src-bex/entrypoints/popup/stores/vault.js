import { defineStore, acceptHMRUpdate } from "pinia";

import { popupMessenger } from "@bex/messaging/popup";
const sendMessageAsync = async (payload) => {
    const { success, data, error } = await popupMessenger.sendMessage("popup", payload);

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

    const currentWallet = ref("");

    watch(wallets, () => {
        let newCurrentWallet;
        if (wallets.value.length > 0) {
            if (!wallets.value.find((wallet) => wallet.address === currentWallet.value)) {
                newCurrentWallet = wallets.value[0]?.address;
            }
        } else {
            newCurrentWallet = "";
        }

        if (newCurrentWallet !== currentWallet.value) {
            currentWallet.value = newCurrentWallet;
        }
    });

    watch(currentWallet, async () => {
        await sendMessageAsync({
            method: "setCurrentWallet",
            params: { currentWallet: currentWallet.value },
        });
    });

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
        const newWallet = await sendMessageAsync({
            method: "addWallet",
            params: { seed, password },
        });
        await getWallets();
        currentWallet.value = newWallet.address;
    };

    const removeWalletAsync = async (address) => {
        await sendMessageAsync({
            method: "removeWallet",
            params: { address },
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
        currentWallet,
        // Actions
        lockAsync,
        unlockAsync,
        updatePasswordAsync,
        getWallets,
        addWalletAsync,
        removeWalletAsync,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useVaultStore, import.meta.hot));
}
