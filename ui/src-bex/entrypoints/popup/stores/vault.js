import { defineStore, acceptHMRUpdate } from "pinia";
import { useVaultService } from "@bex/entrypoints/popup/composables/useVaultService";

export const useVaultStore = defineStore("vaultStore", () => {
    const vaultService = useVaultService();

    // State
    const isLoaded = ref(false);
    const isInitialized = ref(false);
    const isUnlocked = ref(false);

    const wallets = ref([]);
    const currentWalletAddress = ref("");

    const history = ref([]);

    const isActionRunning = ref(false);
    const runningActionCount = ref(0);

    watch(runningActionCount, () => {
        isActionRunning.value = runningActionCount.value !== 0;
    });

    watch(wallets, async () => {
        try {
            runningActionCount.value++;

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
        } finally {
            runningActionCount.value--;
        }
    });

    watch(currentWalletAddress, async () => {
        try {
            runningActionCount.value++;

            if (isUnlocked.value === true) {
                if (currentWalletAddress.value != (await vaultService.getCurrentWalletAddressAsync())) {
                    await vaultService.setCurrentWalletByAddressAsync({ address: currentWalletAddress.value });
                }
            }
        } finally {
            runningActionCount.value--;
        }
    });

    watch(isUnlocked, async () => {
        try {
            runningActionCount.value++;
            await _refresh();
        } finally {
            runningActionCount.value--;
        }
    });

    // Actions
    const lockAsync = async () => {
        isUnlocked.value = (await vaultService.lockAsync()) ?? false;
    };

    const unlockAsync = async ({ password }) => {
        isUnlocked.value = (await vaultService.unlockAsync({ password })) ?? false;
    };

    const updatePasswordAsync = async ({ password, newPassword, rotateMasterKey }) => {
        await vaultService.updatePasswordAsync({ password, newPassword, rotateMasterKey });
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

    // NOTE: Users can delete all vault data at any time without password verification.
    // This is intentional - users should always have the ability to clear their local data,
    // even if they've forgotten their password. This is a "factory reset" operation.
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
        // Always fetch real state from background
        await Promise.all([_refreshIsInitializedAsync(), _refreshIsUnlockedAsync()]);

        if (isUnlocked.value) {
            await _refreshWalletsAsync();
            await _refreshCurrentWalletAddressAsync();
            await updateHistoryAsync();
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

        runningActionCount.value++;
        after(() => {
            runningActionCount.value--;
        });
        onError(() => {
            runningActionCount.value--;
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
        runningActionCount,

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
