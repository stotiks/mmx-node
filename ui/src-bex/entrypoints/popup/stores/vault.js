import { defineStore, acceptHMRUpdate } from "pinia";

/**
 * Vault Store - Store definition only
 *
 * All data fetching has been migrated to TanStack Query.
 * All mutations are handled by TanStack Query mutations.
 *
 * This store is kept for Pinia registration purposes only.
 */
export const useVaultStore = defineStore("vaultStore", () => {
    return {};
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useVaultStore, import.meta.hot));
}
