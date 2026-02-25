import { ECDSA_Wallet } from "@/mmx/wallet/ECDSA_Wallet";
import { mnemonicToSeed } from "@/mmx/wallet/mnemonic";
import { base64 } from "@scure/base";

export const createWalletModule = (dependencies = {}) => {
    const { walletBoundStorage, eventModule, requireUnlocked } = dependencies;

    let currentWalletAddress = null;

    const getNetworkAsync = () => {
        requireUnlocked();
        return "mainnet";
    };

    /**
     * Clean wallet data by removing sensitive fields
     * @param {Object} wallet - Wallet object with sensitive data
     * @returns {Object} Cleaned wallet object
     */
    const walletCleanup = ({ seed, password, ...wallet }) => wallet;
    const walletsCleanup = (wallets) => wallets.map(walletCleanup);

    let cleanedWalletsCache = null;

    eventModule?.on("locked", () => {
        cleanedWalletsCache = null;
    });

    const cacheCleanedWallets = async (wallets$$sensitive) => {
        cleanedWalletsCache = walletsCleanup(wallets$$sensitive);
    };

    const getWalletsAsync$$sensitive = async () => {
        const data$$sensitive = await walletBoundStorage.getAsync();
        const wallets$$sensitive = data$$sensitive?.wallets ?? [];

        cacheCleanedWallets(wallets$$sensitive);
        if (!currentWalletAddress) {
            currentWalletAddress = wallets$$sensitive[0]?.address;
        }

        return wallets$$sensitive;
    };

    const setWalletsAsync$$sensitive = async (wallets$$sensitive) => {
        await walletBoundStorage.setAsync({ wallets: wallets$$sensitive });
        cacheCleanedWallets(wallets$$sensitive);
    };

    const getCleanedWalletsAsync = async () => {
        requireUnlocked();

        if (cleanedWalletsCache) {
            return cleanedWalletsCache;
        }

        const wallets$$sensitive = await getWalletsAsync$$sensitive();
        const cleanedWallets = walletsCleanup(wallets$$sensitive);
        return cleanedWallets;
    };

    const getWalletsAsync = getCleanedWalletsAsync;

    const addWalletAsync = async ({ mnemonic, password }) => {
        requireUnlocked();

        // Create ECDSA wallet to validate mnemonic and get address
        // Use try/finally to ensure destroy() is always called, even if getAddressAsync throws
        const ecdsaWallet = new ECDSA_Wallet(mnemonic, password);
        let address;
        try {
            address = await ecdsaWallet.getAddressAsync(0);
        } finally {
            ecdsaWallet.destroy();
        }

        const seed = base64.encode(mnemonicToSeed(mnemonic));

        const newWallet$$sensitive = { address, seed, password };

        // Check for duplicate wallets
        const wallets = await getWalletsAsync();
        if (wallets.some((wallet) => wallet.address === address)) {
            throw new Error("Wallet already exists");
        }

        const wallets$$sensitive = await getWalletsAsync$$sensitive();
        wallets$$sensitive.push(newWallet$$sensitive);
        await setWalletsAsync$$sensitive(wallets$$sensitive);

        eventModule?.emit("wallet-added", { address });
        return walletCleanup(newWallet$$sensitive);
    };

    const removeWalletAsync = async ({ address }) => {
        requireUnlocked();

        const wallets$$sensitive = await getWalletsAsync$$sensitive();

        const index = wallets$$sensitive.findIndex((wallet) => wallet.address === address);
        if (index === -1) {
            throw new Error("Wallet not found");
        }

        wallets$$sensitive.splice(index, 1);

        await setWalletsAsync$$sensitive(wallets$$sensitive);
        eventModule?.emit("wallet-removed", { address });
    };

    const getCurrentWalletAddress = () => {
        requireUnlocked();
        return currentWalletAddress;
    };

    const setCurrentWalletByAddressAsync = async ({ address }) => {
        requireUnlocked();

        const wallets = await getWalletsAsync();
        if (address && !wallets.some((wallet) => wallet.address === address)) {
            throw new Error(`Wallet with address ${address} not found`);
        }

        currentWalletAddress = address;
        eventModule?.emit("current-wallet-changed", { address });
    };

    /**
     * Get an ECDSA wallet instance for signing transactions
     * @param {Object} params - Parameters
     * @param {string} params.address - Wallet address
     * @returns {Promise<ECDSA_Wallet>} ECDSA wallet instance
     * @throws {Error} If wallet is not found
     */
    const getECDSAWalletAsync = async ({ address }) => {
        requireUnlocked();

        if (!address) {
            throw new Error("No wallet selected");
        }

        const wallets$$sensitive = await getWalletsAsync$$sensitive();
        const wallet$$sensitive = wallets$$sensitive.find((wallet) => wallet.address === address);

        if (!wallet$$sensitive) {
            throw new Error(`Wallet not found for address: ${address}`);
        }

        return new ECDSA_Wallet(base64.decode(wallet$$sensitive.seed), wallet$$sensitive.password);
    };

    /**
     * Execute a callback function with an ECDSA wallet instance and ensure cleanup.
     * This function gets the ECDSA wallet, calls the callback, and destroys the wallet
     * to securely clean up sensitive cryptographic data from memory.
     *
     * @param {string} address - The wallet address
     * @param {Function} callback - Async function that receives the ecdsaWallet instance
     * @returns {Promise<*>} The result of the callback function
     */
    const withECDSAWallet = async (address, callback) => {
        const ecdsaWallet = await getECDSAWalletAsync({ address });
        try {
            return await callback(ecdsaWallet);
        } finally {
            ecdsaWallet.destroy();
        }
    };

    const module = {
        getNetworkAsync,

        getWalletsAsync,
        addWalletAsync,
        removeWalletAsync,

        getCurrentWalletAddress,
        setCurrentWalletByAddressAsync,

        withECDSAWallet,
        getECDSAWalletAsync,
    };

    return module;
};
