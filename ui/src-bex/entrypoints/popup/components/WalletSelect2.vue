<template>
    <q-select
        v-if="wallets.length"
        v-model="currentWalletAddress"
        :options="walletsOptions"
        :display-value="currentWalletAddress ? getShortAddr(currentWalletAddress, 25) : ''"
        emit-value
        map-options
        label="Wallet"
        filled
        dense
    />
    <template v-else>
        <div class="row justify-center">
            <q-btn outline color="primary" @click="router.push('/wallets')"> Add Wallet </q-btn>
        </div>
    </template>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";

const router = useRouter();
const vaultStore = useVaultStore();
const { wallets, currentWalletAddress } = storeToRefs(vaultStore);

const walletsOptions = computed(() =>
    wallets.value.map((wallet) => ({
        label: getShortAddr(wallet.address, 25),
        value: wallet.address,
    }))
);
</script>
