import { defineStore, acceptHMRUpdate } from "pinia";

import { popupMessenger } from "@bex/messaging/popup";
const sendMessageAsync = async (payload) => await popupMessenger.sendMessageAsync("popup", payload);

export const useVaultStore = defineStore("vault", () => {
    // State
    const isLocked = ref(true);
    const wallets = ref([]);

    const currentWalletAddress = ref("");

    watch(wallets, async () => {
        if (currentWalletAddress.value === "") {
            await _updateCurrentWalletAddressAsync();
        }
        let newCurrentWalletAddress = currentWalletAddress.value;
        if (wallets.value.length > 0) {
            if (!wallets.value.find((wallet) => wallet.address === currentWalletAddress.value)) {
                newCurrentWalletAddress = wallets.value[0].address;
            }
        } else {
            newCurrentWalletAddress = "";
        }

        if (newCurrentWalletAddress !== currentWalletAddress.value) {
            currentWalletAddress.value = newCurrentWalletAddress;
        }
    });

    watch(currentWalletAddress, async () => {
        if (!isLocked.value) {
            await sendMessageAsync({
                method: "setCurrentWallet",
                params: { address: currentWalletAddress.value },
            });
        }
    });

    watch(isLocked, async () => {
        if (isLocked.value) {
            // wallets.value = [];
        } else {
            await _updateWalletsAsync();
            await _updateCurrentWalletAddressAsync();
        }
    });

    // Actions
    const lockAsync = async () => {
        isLocked.value = await sendMessageAsync({ method: "lockVault" });
    };

    const unlockAsync = async (password) => {
        isLocked.value = await sendMessageAsync({
            method: "unlockVault",
            params: { password },
        });
    };

    const updatePasswordAsync = async (password, newPassword) => {
        await sendMessageAsync({
            method: "updatePassword",
            params: { password, newPassword },
        });
    };

    const _updateWalletsAsync = async () => {
        wallets.value = await sendMessageAsync({ method: "getWallets" });
    };

    const addWalletAsync = async (seed, password) => {
        const newWallet = await sendMessageAsync({
            method: "addWallet",
            params: { seed, password },
        });
        await _updateWalletsAsync();
        currentWalletAddress.value = newWallet.address;
    };

    const removeWalletAsync = async (address) => {
        await sendMessageAsync({
            method: "removeWallet",
            params: { address },
        });
        await _updateWalletsAsync();
    };

    const _updateIsLockedAsync = async () => {
        isLocked.value = await sendMessageAsync({ method: "getIsLocked" });
    };

    const _updateCurrentWalletAddressAsync = async () => {
        if (!isLocked.value) {
            currentWalletAddress.value = await sendMessageAsync({ method: "getCurrentWalletAddress" });
        }
    };

    //Initialize
    (async () => {
        await _updateIsLockedAsync();
        await _updateCurrentWalletAddressAsync();
    })();

    return {
        // State
        isLocked,
        wallets,
        currentWalletAddress,
        // Actions
        lockAsync,
        unlockAsync,
        updatePasswordAsync,
        addWalletAsync,
        removeWalletAsync,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useVaultStore, import.meta.hot));
}
