import { defineStore, acceptHMRUpdate } from "pinia";
import { vaultService } from "@bex/entrypoints/popup/vaultService";

export const useVaultStore = defineStore("vault", () => {
    // State
    const isInitialized = ref(false);
    const isUnlocked = ref(false);
    const wallets = ref([]);
    const history = ref([]);
    const isActionRunning = ref(false);

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
            await _refresh();
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

    const removeVaultDataAsync = async () => {
        if (isUnlocked.value) {
            await lockAsync();
        }
        await vaultService.removeVaultDataAsync();
        await _refresh();
    };

    const initVaultAsync = async ({ password }) => {
        await vaultService.initVaultAsync({ password });
        await _refresh();
    };

    const allowUrlAsync = async (url) => {
        await vaultService.allowUrlAsync(url);
    };

    const updateHistoryAsync = async () => {
        if (isUnlocked.value) {
            const h = await vaultService.getHistoryAsync();
            history.value = h.sort((a, b) => b.time - a.time);
        }
    };

    const _refreshCurrentWalletAddressAsync = async () => {
        if (isUnlocked.value === true) {
            currentWalletAddress.value = (await vaultService.getCurrentWalletAddressAsync()) ?? "";
        }
    };

    const _refreshIsInitializedAsync = async () => (isInitialized.value = await vaultService.getIsInitializedAsync());
    const _refreshIsUnlockedAsync = async () => (isUnlocked.value = await vaultService.getIsUnlockedAsync());

    const _refresh = async () => {
        await _refreshIsInitializedAsync();
        await _refreshIsUnlockedAsync();
        await updateHistoryAsync();
    };

    //Initialize
    (async () => {
        if ((await _refreshIsInitializedAsync()) === true) {
            if ((await _refreshIsUnlockedAsync()) === true) {
                await _refresh();
            }
        }
    })();

    const vaultStore = useVaultStore();

    vaultStore.$onAction(({ after, onError }) => {
        isActionRunning.value = true;
        after(() => {
            isActionRunning.value = false;
        });
        onError(() => {
            isActionRunning.value = false;
        });
    });

    const store = {
        // State
        isInitialized,
        isUnlocked,
        wallets,
        history,
        currentWalletAddress,
        isActionRunning,
        // Actions
        lockAsync,
        unlockAsync,
        updatePasswordAsync,
        addWalletAsync,
        removeWalletAsync,
        allowUrlAsync,
        removeVaultDataAsync,
        initVaultAsync,
        updateHistoryAsync,
    };

    return store;
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useVaultStore, import.meta.hot));
}
