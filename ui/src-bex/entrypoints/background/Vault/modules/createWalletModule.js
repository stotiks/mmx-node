import { ECDSA_Wallet } from "@/mmx/wallet/ECDSA_Wallet";
import { mnemonicToSeed } from "@/mmx/wallet/mnemonic";
import { base64 } from "@scure/base";

export const createWalletModule = (dependencies = {}) => {
    const { walletBoundStorage, eventModule } = dependencies;

    let currentWalletAddress = null;

    const getNetworkAsync = () => "mainnet";

    /**
     * Clean wallet data by removing sensitive fields
     * @param {Object} wallet - Wallet object with sensitive data
     * @returns {Object} Cleaned wallet object
     */
    const walletCleanup = ({ seed, password, ...wallet }) => wallet;

    const getWalletsAsync$$sensitive = async () => {
        const data = await walletBoundStorage.getAsync();
        const wallets = data.wallets || [];

        return wallets;
    };

    const getWalletsAsync = async () => {
        const wallets = await getWalletsAsync$$sensitive();
        return wallets.map((wallet) => walletCleanup(wallet));
    };

    const addWalletAsync = async ({ mnemonic, password }) => {
        // Create ECDSA wallet to validate mnemonic and get address
        const ecdsaWallet = new ECDSA_Wallet(mnemonic, password);
        const address = await ecdsaWallet.getAddressAsync(0);
        const seed = base64.encode(mnemonicToSeed(mnemonic));

        const newWallet$$sensitive = { address, seed, password };

        // Check for duplicate wallets
        const wallets$$sensitive = await getWalletsAsync$$sensitive();
        if (wallets$$sensitive.some((wallet) => wallet.address === address)) {
            throw new Error("Wallet already exists");
        }

        wallets$$sensitive.push(newWallet$$sensitive);
        await walletBoundStorage.setAsync({ wallets: wallets$$sensitive });

        eventModule.emit("wallet-added", { address });
        return walletCleanup(newWallet$$sensitive);
    };

    const removeWalletAsync = async ({ address }) => {
        const wallets$$sensitive = await getWalletsAsync$$sensitive();

        const index = wallets$$sensitive.findIndex((wallet) => wallet.address === address);
        if (index === -1) {
            throw new Error("Wallet not found");
        }

        wallets$$sensitive.splice(index, 1);

        await walletBoundStorage.setAsync({ wallets: wallets$$sensitive });
        eventModule.emit("wallet-removed", { address });
    };

    const getCurrentWalletAddress = () => currentWalletAddress;

    const setCurrentWalletByAddressAsync = async ({ address }) => {
        const wallets = await getWalletsAsync();
        if (address && !wallets.some((wallet) => wallet.address === address)) {
            throw new Error(`Wallet with address ${address} not found`);
        }

        currentWalletAddress = address;
        eventModule.emit("current-wallet-changed", { address });
    };

    /**
     * Get an ECDSA wallet instance for signing transactions
     * @param {Object} params - Parameters
     * @param {string} params.address - Wallet address
     * @returns {Promise<ECDSA_Wallet>} ECDSA wallet instance
     * @throws {Error} If wallet is not found
     */
    const getECDSAWalletAsync = async ({ address }) => {
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

    const module = {
        getNetworkAsync,

        getWalletsAsync,
        addWalletAsync,
        removeWalletAsync,

        getCurrentWalletAddress,
        setCurrentWalletByAddressAsync,

        getECDSAWalletAsync,
    };

    return module;
};
