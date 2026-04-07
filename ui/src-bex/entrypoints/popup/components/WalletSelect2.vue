<template>
    <q-select
        v-if="isLoading || (wallets && wallets.length)"
        :model-value="currentWallet"
        :options="walletsOptions"
        :display-value="currentWallet ? getShortAddr(currentWallet, 25) : ''"
        emit-value
        map-options
        label="Wallet"
        filled
        dense
        :loading="isLoading"
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
import {
    useWalletsQuery,
    useCurrentWalletQuery,
    useIsUnlockedQuery,
} from "@bex/entrypoints/popup/queries/vaultQueries";
import { useSetCurrentWalletMutation } from "@bex/entrypoints/popup/queries/vaultMutations";

const router = useRouter();

const { data: isUnlocked } = useIsUnlockedQuery();
const { data: wallets, isLoading } = useWalletsQuery();
const { data: currentWallet } = useCurrentWalletQuery(isUnlocked);
const setCurrentWalletMutation = useSetCurrentWalletMutation();

const walletsOptions = computed(() =>
    (wallets.value || []).map((wallet) => ({
        label: getShortAddr(wallet.address, 25),
        value: wallet.address,
    }))
);

// Use the mutation to set current wallet
// so the background vault is kept in sync.
const handleWalletChange = async (address) => {
    setCurrentWalletMutation.mutate({ address });
};

const $q = useQuasar();
const handleAddWallet = () => {
    $q.dialog({
        component: defineAsyncComponent(() => import("@bex/entrypoints/popup/components/dialogs/AddWalletDialog")),
        componentProps: {},
    }).onOk(() => {});
};
</script>
