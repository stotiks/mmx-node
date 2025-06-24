<template>
    <q-select
        v-model="currentWalletAddress"
        :options="walletsOptions"
        :display-value="currentWalletAddress ? getShortAddr(currentWalletAddress, 25) : ''"
        emit-value
        map-options
        label="Wallet"
        filled
        dense
    />
</template>

<script setup>
import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { wallets, currentWalletAddress } = storeToRefs(vaultStore);

const walletsOptions = computed(() =>
    wallets.value.map((wallet) => ({
        label: getShortAddr(wallet.address, 25),
        value: wallet.address,
    }))
);
</script>
