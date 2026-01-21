import vault from "@bex/entrypoints/background/vault";

/**
 * Creates a pre-hook that blocks vault method calls when the vault is locked
 *
 * This hook enforces vault lock state by preventing access to sensitive methods
 * when the vault is locked. Only essential methods for vault management are allowed
 * when locked: unlockAsync, getIsUnlocked, initAsync, getIsInitializedAsync, clearAllAsync.
 *
 * @returns {Function} Pre-hook function that receives context and throws error if vault is locked
 */
const createVaultLockHook = () => {
    // Methods that are allowed even when the vault is locked
    const allowedWhenLocked = ["unlockAsync", "getIsUnlocked", "initAsync", "getIsInitializedAsync", "clearAllAsync"];

    return async (context) => {
        const { handler } = context;

        // Get the resolved method name from the handler
        const methodName = handler?.name;

        // Check if the method is allowed when locked
        if (allowedWhenLocked.includes(methodName)) {
            // Method is allowed, let it proceed
            return;
        }

        // For all other methods, check if vault is unlocked
        if (!vault.getIsUnlocked()) {
            throw new Error("Vault is locked. Please unlock the vault first.");
        }
    };
};

export default createVaultLockHook;
