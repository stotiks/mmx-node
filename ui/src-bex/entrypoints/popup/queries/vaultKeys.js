/**
 * Centralized query key factory for vault-related TanStack Query keys.
 * Using a single source of truth prevents key mismatches across queries and mutations.
 */
export const vaultKeys = {
    all: () => ["vault"],
    data: () => ["vault", "data"],

    isInitialized: () => ["vault", "status", "isInitialized"],
    isUnlocked: () => ["vault", "status", "isUnlocked"],

    wallets: () => ["vault", "data", "wallets"],
    currentWallet: () => ["vault", "data", "currentWallet"],

    history: () => ["vault", "data", "history"],

    urlPermissions: (url) => ["vault", "data", "urlPermissions", url],
};
