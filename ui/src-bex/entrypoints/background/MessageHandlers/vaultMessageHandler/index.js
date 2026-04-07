import vault from "@bex/entrypoints/background/vault";
import { MessageHandler } from "@bex/messaging/MessageHandler";

/**
 * Whitelist of safe vault methods that can be accessed via message handler.
 */
const storageAPI = {
    // Storage manager interface
    getIsInitializedAsync: vault.getIsInitializedAsync,
    initAsync: vault.initAsync,
    getIsUnlocked: vault.getIsUnlocked,
    unlockAsync: vault.unlockAsync,
    lock: vault.lock,
    clearAllAsync: vault.clearAllAsync,
    updatePasswordAsync: vault.updatePasswordAsync,
};

const otherAPI = {
    // Wallet interface
    getNetworkAsync: vault.getNetworkAsync,
    getWalletsAsync: vault.getWalletsAsync,
    addWalletAsync: vault.addWalletAsync,
    removeWalletAsync: vault.removeWalletAsync,
    getCurrentWalletAddressAsync: vault.getCurrentWalletAddressAsync,
    setCurrentWalletByAddressAsync: vault.setCurrentWalletByAddressAsync,
    // getECDSAWalletAsync: EXCLUDED - exposes raw private key material

    // History interface
    getHistoryAsync: vault.getHistoryAsync,
    // addHistoryAsync: vault.addHistoryAsync,
    // clearHistoryAsync: vault.clearHistoryAsync,
    getHistoryCountAsync: vault.getHistoryCountAsync,

    // Permission interface
    checkUrlPermissionsAsync: vault.checkUrlPermissionsAsync,
    allowUrlAsync: vault.allowUrlAsync,
    revokeUrlAsync: vault.revokeUrlAsync,
    getAllowedOrigins: vault.getAllowedOrigins,

    // Reset idle timeout
    resetIdleTimeout: vault.resetIdleTimeout,
};

const vaultPublicAPI = {
    ...storageAPI,
    ...otherAPI,
};

const activityTrackedMethods = {
    ...otherAPI,
};

const vaultMessageHandler = new MessageHandler(vaultPublicAPI);

import { createResetTimeoutHook } from "./hooks/createResetTimeoutHook";
vaultMessageHandler.addPreHook(createResetTimeoutHook(vault.resetIdleTimeout, activityTrackedMethods), {
    fireAndForget: true,
});

export default vaultMessageHandler;
