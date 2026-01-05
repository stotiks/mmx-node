import { abytes, randomBytes } from "@noble/hashes/utils.js";
import { EncryptedStorageItem } from "../storage/EncryptedStorageItem";

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
        if (masterKey === null) {
            throw new Error("Vault is locked");
        }
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

    const initAsync = async ({ password }) => {
        if (await getIsInitializedAsync()) {
            throw new Error("Vault is already initialized.");
        }

        const masterKey = randomBytes(32);
        await masterKeyStorage.setAsync({ masterKey: Array.from(masterKey) }, password);

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

    const unlockAsync = async ({ password }) => {
        const { masterKey } = await masterKeyStorage.getAsync(password);
        setMasterKey(Uint8Array.from(masterKey));

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
        unlockAsync,
        lock,
        //
        clearAllAsync,
        //
        getBoundStorage,
    };

    return module;
};
