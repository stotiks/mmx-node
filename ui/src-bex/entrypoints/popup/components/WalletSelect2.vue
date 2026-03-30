<template>
    <q-select
        v-if="wallets.length"
        :model-value="currentWalletAddress"
        :options="walletsOptions"
        :display-value="currentWalletAddress ? getShortAddr(currentWalletAddress, 25) : ''"
        emit-value
        map-options
        label="Wallet"
        filled
        dense
        @update:model-value="handleWalletChange"
    />
    <template v-else>
        <div class="row justify-center">
            <q-btn
                flat
                color="primary"
                class="animate__animated animate__pulse animate__infinite"
                @click="handleAddWallet()"
            >
                Add Wallet
            </q-btn>
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

// Use the store action instead of writing currentWalletAddress directly,
// so the background vault is kept in sync.
const handleWalletChange = async (address) => {
    await vaultStore.setCurrentWalletAsync({ address });
};

const $q = useQuasar();
const handleAddWallet = () => {
    $q.dialog({
        component: defineAsyncComponent(() => import("@bex/entrypoints/popup/components/dialogs/AddWalletDialog")),
        componentProps: {},
    }).onOk(() => {});
};
</script>
