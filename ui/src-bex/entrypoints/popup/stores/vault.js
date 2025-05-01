import { defineStore, acceptHMRUpdate } from "pinia";
import { vaultApiService } from "../vaultApiService";

export const useVaultStore = defineStore("vault", () => {
    // State
    const isLocked = ref(true);
    const wallets = ref([]);

    const currentWalletAddress = ref("");

    watch(wallets, async () => {
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
            if (currentWalletAddress.value != (await vaultApiService.getCurrentWalletAddressAsync())) {
                await vaultApiService.setCurrentWalletAsync({ address: currentWalletAddress.value });
            }
        }
    });

    watch(isLocked, async () => {
        if (isLocked.value) {
            // wallets.value = [];
        } else {
            await _updateCurrentWalletAddressAsync();
            await _updateWalletsAsync();
        }
    });

    // Actions
    const lockAsync = async () => {
        isLocked.value = await vaultApiService.lockVaultAsync();
    };

    const unlockAsync = async ({ password }) => {
        isLocked.value = await vaultApiService.unlockVaultAsync({ password });
    };

    const updatePasswordAsync = async ({ password, newPassword }) => {
        await vaultApiService.updatePasswordAsync({ password, newPassword });
    };

    const _updateWalletsAsync = async () => {
        wallets.value = await vaultApiService.getWalletsAsync();
    };

    const addWalletAsync = async ({ mnemonic, password }) => {
        const newWallet = await vaultApiService.addWalletAsync({ mnemonic, password });
        await _updateWalletsAsync();
        currentWalletAddress.value = newWallet.address;
    };

    const removeWalletAsync = async ({ address }) => {
        await vaultApiService.removeWalletAsync({ address });
        await _updateWalletsAsync();
    };

    const _updateCurrentWalletAddressAsync = async () => {
        if (!isLocked.value) {
            currentWalletAddress.value = (await vaultApiService.getCurrentWalletAddressAsync()) ?? "";
        }
    };

    const _updateIsLockedAsync = async () => {
        isLocked.value = await vaultApiService.getIsLockedAsync();
    };

    //Initialize
    (async () => {
        await _updateIsLockedAsync();
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
