/**
 * Centralized query key factory for vault-related TanStack Query keys.
 * Using a single source of truth prevents key mismatches across queries and mutations.
 */
export const vaultKeys = {
    all: () => ["vault"],

    isInitialized: () => ["vault", "isInitialized"],
    isUnlocked: () => ["vault", "isUnlocked"],

    wallets: () => ["vault", "wallets"],
    currentWallet: () => ["vault", "currentWallet"],

    history: () => ["vault", "history"],

    urlPermissions: (url) => ["vault", "urlPermissions", url],
};
