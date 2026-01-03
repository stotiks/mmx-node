import { createEventModule } from "./modules/createEventModule";
import { createPermissionModule } from "./modules/createPermissionModule";
import { createStorageManagerModule } from "./modules/createStorageManagerModule";
import { createWalletModule } from "./modules/createWalletModule";
import { EncryptedStorageItem } from "./storage/EncryptedStorageItem";

export const createVault = (dependencies = {}) => {
    // Set up dependencies with defaults
    const {
        masterKeyStorage = new EncryptedStorageItem("local:master"),
        walletStorage = new EncryptedStorageItem("local:wallets"),
        historyStorage = new EncryptedStorageItem("local:history"),
        maxHistoryEntries = 10,
    } = dependencies;

    const eventModule = createEventModule();
    const storageManagerModule = createStorageManagerModule({
        masterKeyStorage,
        managedStorages: [walletStorage, historyStorage],
        eventModule,
    });
    const permissionModule = createPermissionModule({ eventModule });

    const walletBoundStorage = storageManagerModule.getBoundStorage(walletStorage);

    const walletModule = createWalletModule({
        walletBoundStorage,
        eventModule,
    });

    // Compose the final vault interface
    const vault = {
        // Storage manager interface
        getIsInitializedAsync: storageManagerModule.getIsInitializedAsync,
        initAsync: storageManagerModule.initAsync,

        getIsUnlockedAsync: storageManagerModule.getIsUnlockedAsync,
        unlockAsync: storageManagerModule.unlockAsync,
        lockAsync: storageManagerModule.lockAsync,

        clearAllAsync: storageManagerModule.clearAllAsync,

        // Wallet interface
        getNetworkAsync: walletModule.getNetworkAsync,

        getWalletsAsync: walletModule.getWalletsAsync,
        addWalletAsync: walletModule.addWalletAsync,
        removeWalletAsync: walletModule.removeWalletAsync,

        getCurrentWalletAddressAsync: walletModule.getCurrentWalletAddressAsync,
        setCurrentWalletByAddressAsync: walletModule.setCurrentWalletByAddressAsync,

        // History interface
        getHistoryAsync: storageManagerModule.getBoundStorage(historyStorage).getAsync,
        setHistoryAsync: storageManagerModule.getBoundStorage(historyStorage).setAsync,

        // Network interface

        // Permission interface
        checkUrlPermissionsAsync: permissionModule.checkUrlPermissionsAsync,
        allowUrlAsync: permissionModule.allowUrlAsync,

        // // Event interface
        on: eventModule.on,
        removeListener: eventModule.removeListener,
    };

    return vault;
};
