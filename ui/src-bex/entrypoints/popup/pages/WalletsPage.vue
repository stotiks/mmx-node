<template>
    <q-page padding>
        <div class="q-gutter-y-sm">
            <q-table
                :rows="wallets"
                :columns="columns"
                :pagination="{ rowsPerPage: 0 }"
                hide-pagination
                hide-header
                flat
            >
                <template v-slot:body-cell-actions="bcProps">
                    <q-td :props="bcProps">
                        <q-btn flat :icon="mdiDelete" @click="handleRemoveWalletAsync(bcProps.row.address)" />
                    </q-td>
                </template>
            </q-table>

            <q-card flat class="q-mt-md">
                <q-card-section class="q-gutter-y-sm">
                    <div>Add wallet</div>
                    <q-input v-model="newWalletMnemonic" label="Mnemonic" filled dense />
                    <q-input v-model="newWalletPassword" label="Password" filled dense />
                    <q-btn flat @click="handleAddWalletAsync">Add</q-btn>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import { mdiDelete } from "@mdi/js";
import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { wallets, currentWalletAddress } = storeToRefs(vaultStore);

const columns = computed(() => [
    {
        name: "height",
        label: "Wallet",
        field: "address",
        align: "left",
        format: (val) => getShortAddr(val, 25),
    },
    { name: "actions", label: "", align: "right" },
]);

const test_mnemonic = process.env.NODE_ENV === "development" && import.meta.env.VITE_TEST_MNEMONIC;
const newWalletMnemonic = ref(test_mnemonic || "");
const newWalletPassword = ref("");

const handleAddWalletAsync = async () => {
    await tryCatchWrapperAsync(() =>
        vaultStore.addWalletAsync({ mnemonic: newWalletMnemonic.value, password: newWalletPassword.value })
    );
};

const handleRemoveWalletAsync = async (address) => {
    await tryCatchWrapperAsync(() => vaultStore.removeWalletAsync({ address }));
};
</script>
