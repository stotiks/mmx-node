import { createEventModule } from "./modules/createEventModule";
import { createPermissionModule } from "./modules/createPermissionModule";
import { createStorageManagerModule } from "./modules/createStorageManagerModule";
import { createWalletModule } from "./modules/createWalletModule";
import { EncryptedStorageItem } from "./storage/EncryptedStorageItem";

export const createVault = (dependencies = {}) => {
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

        getIsUnlocked: storageManagerModule.getIsUnlocked,
        unlockAsync: storageManagerModule.unlockAsync,
        lock: storageManagerModule.lock,

        clearAllAsync: storageManagerModule.clearAllAsync,

        // Wallet interface
        getNetworkAsync: walletModule.getNetworkAsync,

        getWalletsAsync: walletModule.getWalletsAsync,
        addWalletAsync: walletModule.addWalletAsync,
        removeWalletAsync: walletModule.removeWalletAsync,

        getCurrentWalletAddress: walletModule.getCurrentWalletAddress,
        setCurrentWalletByAddressAsync: walletModule.setCurrentWalletByAddressAsync,

        getECDSAWalletAsync: walletModule.getECDSAWalletAsync,

        // History interface
        getHistoryAsync: storageManagerModule.getBoundStorage(historyStorage).getAsync,
        setHistoryAsync: storageManagerModule.getBoundStorage(historyStorage).setAsync,

        // Permission interface
        checkUrlPermissionsAsync: permissionModule.checkUrlPermissionsAsync,
        allowUrlAsync: permissionModule.allowUrlAsync,
        revokeUrlAsync: permissionModule.revokeUrlAsync,
        getAllowedOrigins: permissionModule.getAllowedOrigins,

        // // Event interface
        on: eventModule.on,
        removeListener: eventModule.removeListener,
    };

    return vault;
};
