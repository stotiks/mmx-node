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

    const getWalletsAsync = async () => {
        const data = await walletBoundStorage.getAsync();
        const wallets = data.wallets || [];

        return wallets.map((wallet) => walletCleanup(wallet));
    };

    const addWalletAsync = async ({ mnemonic, password }) => {
        // Create ECDSA wallet to validate mnemonic and get address
        const ecdsaWallet = new ECDSA_Wallet(mnemonic, password);
        const address = await ecdsaWallet.getAddressAsync(0);
        const seed = base64.encode(mnemonicToSeed(mnemonic));

        const newWallet = { address, seed, password };

        // Check for duplicate wallets
        const existingWallets = await getWalletsAsync();
        if (existingWallets.some((wallet) => wallet.address === address)) {
            throw new Error("Wallet already exists");
        }

        existingWallets.push(newWallet);
        await walletBoundStorage.setAsync({ wallets: existingWallets });

        eventModule.emit("wallet-added", { address });
        return walletCleanup(newWallet);
    };

    const removeWalletAsync = async ({ address }) => {
        const wallets = await getWalletsAsync();

        const index = wallets.findIndex((wallet) => wallet.address === address);
        if (index === -1) {
            throw new Error("Wallet not found");
        }

        wallets.splice(index, 1);

        await walletBoundStorage.setAsync({ wallets });
        eventModule.emit("wallet-removed", { address });
    };

    const getCurrentWalletAddressAsync = () => currentWalletAddress;

    const setCurrentWalletByAddressAsync = async ({ address }) => {
        const wallets = await getWalletsAsync();
        if (address && !wallets.some((wallet) => wallet.address === address)) {
            throw new Error(`Wallet with address ${address} not found`);
        }

        currentWalletAddress = address;
        eventModule.emit("current-wallet-changed", { address });
    };

    const module = {
        getNetworkAsync,

        getWalletsAsync,
        addWalletAsync,
        removeWalletAsync,

        getCurrentWalletAddressAsync,
        setCurrentWalletByAddressAsync,
    };

    return module;
};
