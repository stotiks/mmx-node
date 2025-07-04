<template>
    <q-page padding>
        <div class="q-gutter-y-md">
            <WalletSelect2 />
            <BalanceTable :address="currentWalletAddress" dense use-short-addr :use-contract-link="false" show-empty />
        </div>
    </q-page>
</template>

<script setup>
import WalletSelect2 from "@bex/entrypoints/popup/components/WalletSelect2";

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { currentWalletAddress } = storeToRefs(vaultStore);
</script>
