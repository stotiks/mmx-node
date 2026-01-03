import { EncryptedStorageItem } from "./storage/EncryptedStorageItem";
import { createEventModule } from "./modules/createEventModule";
import { createPermissionModule } from "./modules/createPermissionModule";

export const createVault = (dependencies = {}) => {
    // Set up dependencies with defaults
    const {
        walletStorage = new EncryptedStorageItem("local:wallets"),
        historyStorage = new EncryptedStorageItem("local:history"),
        maxHistoryEntries = 10,
    } = dependencies;

    const eventModule = createEventModule();
    const permissionModule = createPermissionModule({ eventModule });

    // Compose the final vault interface
    const vault = {
        // Permission interface
        checkUrlPermissionsAsync: permissionModule.checkUrlPermissionsAsync,
        allowUrlAsync: permissionModule.allowUrlAsync,

        // Event interface
        on: eventModule.on,
        removeListener: eventModule.removeListener,
        emit: eventModule.emit,
    };

    return vault;
};
