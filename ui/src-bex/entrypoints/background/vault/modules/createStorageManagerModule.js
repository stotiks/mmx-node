import { abytes, randomBytes } from "@noble/hashes/utils.js";
import { EncryptedStorageItem } from "../storage/EncryptedStorageItem";
import { base64 } from "@scure/base";

export const createStorageManagerModule = (dependencies = {}) => {
    const { masterKeyStorage, managedStorages, eventModule } = dependencies;

    // Private state
    let masterKey = null; // Uint8Array | null

    // ========================================================================
    // PRIVATE: Master Key Lifecycle
    // ========================================================================

    /**
     * Set the master key in memory (private)
     * Validates input and zeros old key before replacing
     * @param {Uint8Array} bytes - The new master key bytes
     * @throws {Error} If bytes is not a Uint8Array
     */
    const setMasterKey = (bytes) => {
        abytes(bytes); // Validates that bytes is a Uint8Array

        clearMasterKey();

        masterKey = bytes;
    };

    // /**
    //  * Get the master key (private)
    //  * @returns {Uint8Array | null} The current master key or null
    //  */
    // const getMasterKey = () => {
    //     return masterKey;
    // };

    /**
     * Require that a master key is present (private)
     * @returns {Uint8Array} The current master key
     * @throws {Error} If no master key is loaded
     */
    const requireMasterKey = () => {
        requireUnlocked();
        return masterKey;
    };

    /**
     * Clear the master key from memory (private)
     * Zeros the bytes before clearing the reference
     */
    const clearMasterKey = () => {
        if (masterKey !== null) {
            masterKey.fill(0);
            masterKey = null;
        }
    };

    /**
     * Check if a persisted master key storage exists
     * @returns {Promise<boolean>} True if persisted key exists
     */
    const hasPersistedMasterKey = async () => {
        return await masterKeyStorage.existsAsync();
    };

    const getIsInitializedAsync = async () => {
        return await hasPersistedMasterKey();
    };

    const getIsUnlocked = () => {
        return masterKey !== null;
    };

    /**
     * Require that the vault is unlocked
     * @throws {Error} If vault is locked
     */
    const requireUnlocked = () => {
        if (!getIsUnlocked()) {
            throw new Error("Vault is locked. Please unlock the vault first.");
        }
    };

    const initAsync = async ({ password }) => {
        if (await getIsInitializedAsync()) {
            throw new Error("Vault is already initialized.");
        }

        const masterKey = randomBytes(32);
        await masterKeyStorage.setAsync({ masterKey: base64.encode(masterKey) }, password);

        for (const managedStorage of managedStorages) {
            await managedStorage.setAsync({}, masterKey);
        }

        masterKey.fill(0);

        eventModule.emit("initialized");
    };

    const clearAllAsync = async () => {
        clearMasterKey();

        await masterKeyStorage.removeAsync();

        for (const managedStorage of managedStorages) {
            await managedStorage.removeAsync();
        }

        eventModule.emit("vault-removed");
    };

    const updatePasswordAsync = async ({ password, newPassword, rotateMasterKey = false }) => {
        requireUnlocked();

        if (typeof password !== "string" || !password || typeof newPassword !== "string" || !newPassword) {
            throw new Error("Passwords must be non-empty strings");
        }

        if (typeof rotateMasterKey !== "boolean") {
            throw new Error("rotateMasterKey must be a boolean");
        }

        // This comparison is not a security risk because it does not involve a secret value.
        // It's a simple validation check to ensure the new password is not the same as the old one.
        // The actual credential check is performed later by decrypting the persisted master key, which is safe.
        // eslint-disable-next-line security/detect-possible-timing-attacks
        if (password === newPassword) {
            throw new Error("New password must be different from the old password.");
        }

        // Verify old password by attempting to decrypt the persisted master key.
        // If decryption fails, the underlying storage will throw.
        const { masterKey: persistedMasterKey } = await masterKeyStorage.getAsync(password);
        const verifiedMasterKey = base64.decode(persistedMasterKey);

        const nextMasterKey = rotateMasterKey ? randomBytes(32) : verifiedMasterKey;

        // Persist master key under new password.
        await masterKeyStorage.setAsync({ masterKey: base64.encode(nextMasterKey) }, newPassword);

        if (rotateMasterKey) {
            // Keep in-memory state in sync if we're rotating keys.
            setMasterKey(nextMasterKey);

            // Re-encrypt all managed storages.
            // - Decrypt using verified key (the currently active key)
            // - Encrypt using next key (same key unless rotateMasterKey=true)
            for (const managedStorage of managedStorages) {
                const data = await managedStorage.getAsync(verifiedMasterKey);
                await managedStorage.setAsync(data, nextMasterKey);
            }
        }

        verifiedMasterKey.fill(0);
        if (rotateMasterKey) {
            // If rotated, nextMasterKey is the new in-memory masterKey; do not zero it.
            // If not rotated, nextMasterKey === verifiedMasterKey which has already been zeroed.
        }

        eventModule.emit("password-updated");
        return true;
    };

    const unlockAsync = async ({ password }) => {
        const { masterKey } = await masterKeyStorage.getAsync(password);
        setMasterKey(base64.decode(masterKey));

        eventModule.emit("unlocked");
        return getIsUnlocked();
    };

    const lock = () => {
        clearMasterKey();
        eventModule.emit("locked");
        return getIsUnlocked();
    };

    /**
     * Get a bound adapter for a storage item
     * The adapter automatically injects the master key on get/set operations
     * @param {EncryptedStorageItem} storage - Storage
     * @returns {Object} Adapter with getAsync() and setAsync() methods
     * @throws {Error} If item is not registered
     */
    const getBoundStorage = (storage) => {
        if (typeof storage !== "object" && !(storage instanceof EncryptedStorageItem)) {
            throw new Error("Invalid storage type");
        }

        const managedStorage = managedStorages.find((item) => item === storage);

        return {
            /**
             * Get data from storage, automatically using the current master key
             * @returns {Promise<any>} The decrypted data
             */
            getAsync: () => {
                const key = requireMasterKey();
                return managedStorage.getAsync(key);
            },

            /**
             * Set data to storage, automatically using the current master key
             * @param {any} data - Data to encrypt and store
             * @returns {Promise<void>}
             */
            setAsync: (data) => {
                const key = requireMasterKey();
                return managedStorage.setAsync(data, key);
            },
        };
    };

    const module = {
        getIsInitializedAsync,
        initAsync,
        //
        getIsUnlocked,
        requireUnlocked,
        unlockAsync,
        lock,
        //
        clearAllAsync,
        updatePasswordAsync,
        //
        getBoundStorage,
    };

    return module;
};
