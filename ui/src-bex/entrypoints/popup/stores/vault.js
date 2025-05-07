import { defineStore, acceptHMRUpdate } from "pinia";
import { vaultService } from "@bex/entrypoints/popup/vaultService";

export const useVaultStore = defineStore("vault", () => {
    // State
    const isUnlocked = ref(true);
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
        if (isUnlocked.value === true) {
            if (currentWalletAddress.value != (await vaultService.getCurrentWalletAddressAsync())) {
                await vaultService.setCurrentWalletAsync({ address: currentWalletAddress.value });
            }
        }
    });

    watch(isUnlocked, async () => {
        if (isUnlocked.value === true) {
            await _refreshCurrentWalletAddressAsync();
            await _refreshWalletsAsync();
        }
    });

    // Actions
    const lockAsync = async () => {
        isUnlocked.value = await vaultService.lockAsync();
    };

    const unlockAsync = async ({ password }) => {
        isUnlocked.value = await vaultService.unlockAsync({ password });
    };

    const updatePasswordAsync = async ({ password, newPassword }) => {
        await vaultService.updatePasswordAsync({ password, newPassword });
    };

    const _refreshWalletsAsync = async () => {
        wallets.value = await vaultService.getWalletsAsync();
    };

    const addWalletAsync = async ({ mnemonic, password }) => {
        const newWallet = await vaultService.addWalletAsync({ mnemonic, password });
        await _refreshWalletsAsync();
        currentWalletAddress.value = newWallet.address;
    };

    const removeWalletAsync = async ({ address }) => {
        await vaultService.removeWalletAsync({ address });
        await _refreshWalletsAsync();
    };

    const allowUrlAsync = async (url) => {
        await vaultService.allowUrlAsync(url);
    };

    const _refreshCurrentWalletAddressAsync = async () => {
        if (isUnlocked.value === true) {
            currentWalletAddress.value = (await vaultService.getCurrentWalletAddressAsync()) ?? "";
        }
    };

    const _refreshIsUnlockedAsync = async () => {
        isUnlocked.value = await vaultService.getIsUnlockedAsync();
    };

    //Initialize
    (async () => {
        await _refreshIsUnlockedAsync();
        if (isUnlocked.value === true) {
            await _refreshCurrentWalletAddressAsync();
            await _refreshWalletsAsync();
        }
    })();

    return {
        // State
        isUnlocked,
        wallets,
        currentWalletAddress,
        // Actions
        lockAsync,
        unlockAsync,
        updatePasswordAsync,
        addWalletAsync,
        removeWalletAsync,
        allowUrlAsync,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useVaultStore, import.meta.hot));
}
