import vault from "@bex/entrypoints/background/vault";
import { MessageHandler } from "@bex/messaging/MessageHandler";

/**
 * Whitelist of safe vault methods that can be accessed via message handler.
 */
const vaultPublicAPI = {
    // Storage manager interface
    getIsInitializedAsync: vault.getIsInitializedAsync,
    initAsync: vault.initAsync,
    getIsUnlocked: vault.getIsUnlocked,
    unlockAsync: vault.unlockAsync,
    lock: vault.lock,
    clearAllAsync: vault.clearAllAsync,
    updatePasswordAsync: vault.updatePasswordAsync,

    // Wallet interface
    getNetworkAsync: vault.getNetworkAsync,
    getWalletsAsync: vault.getWalletsAsync,
    addWalletAsync: vault.addWalletAsync,
    removeWalletAsync: vault.removeWalletAsync,
    getCurrentWalletAddress: vault.getCurrentWalletAddress,
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
};

const vaultMessageHandler = new MessageHandler(vaultPublicAPI);

export default vaultMessageHandler;
