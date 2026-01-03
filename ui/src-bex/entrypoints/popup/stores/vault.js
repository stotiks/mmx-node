import { defineStore, acceptHMRUpdate } from "pinia";
import { vaultService } from "@bex/entrypoints/popup/vaultService";

export const useVaultStore = defineStore("vault", () => {
    // State
    const isLoaded = ref(false);
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
                await vaultService.setCurrentWalletByAddressAsync({ address: currentWalletAddress.value });
            }
        }
    });

    watch(isUnlocked, async () => {
        await _refresh();
    });

    // Actions
    const lockAsync = async () => {
        isUnlocked.value = (await vaultService.lockAsync()) ?? false;
    };

    const unlockAsync = async ({ password }) => {
        isUnlocked.value = (await vaultService.unlockAsync({ password })) ?? false;
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

    const clearAllAsync = async () => {
        if (isUnlocked.value) {
            await lockAsync();
        }
        await vaultService.clearAllAsync();
        await _refresh();
    };

    const initAsync = async ({ password }) => {
        await vaultService.initAsync({ password });
        await _refresh();
    };

    const checkUrlPermissionsAsync = async (url) => {
        return await vaultService.checkUrlPermissionsAsync(url);
    };

    const allowUrlAsync = async (url) => {
        await vaultService.allowUrlAsync(url);
    };

    const updateHistoryAsync = async () => {
        const h = await vaultService.getHistoryAsync();
        history.value = h.sort((a, b) => b.timestamp - a.timestamp);
    };

    const _refreshCurrentWalletAddressAsync = async () => {
        if (isUnlocked.value === true) {
            currentWalletAddress.value = (await vaultService.getCurrentWalletAddressAsync()) ?? "";
        }
    };

    const _refreshIsInitializedAsync = async () =>
        (isInitialized.value = (await vaultService.getIsInitializedAsync()) ?? false);
    const _refreshIsUnlockedAsync = async () => (isUnlocked.value = (await vaultService.getIsUnlockedAsync()) ?? false);

    const _refresh = async () => {
        const [isInit, isUnlock] = await Promise.all([_refreshIsInitializedAsync(), _refreshIsUnlockedAsync()]);

        if (isInit === true && isUnlock === true && isUnlocked.value === true) {
            await _refreshWalletsAsync();
            //await updateHistoryAsync();
        }
    };

    onMounted(async () => {
        await _refresh();
        isLoaded.value = true;
    });

    const vaultStore = useVaultStore();

    vaultStore.$onAction(({ name, after, onError }) => {
        if (name == "updateHistoryAsync") {
            return;
        }

        isActionRunning.value = true;
        after(() => {
            isActionRunning.value = false;
        });
        onError(() => {
            isActionRunning.value = false;
        });
    });

    return {
        // State
        isLoaded,
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
        checkUrlPermissionsAsync,
        allowUrlAsync,
        clearAllAsync,
        initAsync,
        updateHistoryAsync,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useVaultStore, import.meta.hot));
}
