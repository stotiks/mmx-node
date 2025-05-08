<template>
    <q-page padding>
        <div class="q-gutter-y-sm">
            <q-card flat>
                <q-card-section class="q-gutter-y-sm">
                    <div>Add wallet</div>
                    <q-input v-model="newWalletMnemonic" label="Mnemonic" filled dense />
                    <q-input v-model="newWalletPassword" label="Password" filled dense />
                    <q-btn flat @click="handleAddWalletAsync">Add</q-btn>
                </q-card-section>
            </q-card>
            <q-card flat>
                <q-card-section class="q-gutter-y-sm">
                    <WalletSelect2 />
                    <q-btn
                        flat
                        :disabled="currentWalletAddress === ''"
                        @click="handleRemoveWalletAsync(currentWalletAddress)"
                    >
                        Remove
                    </q-btn>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import WalletSelect2 from "@bex/entrypoints/popup/components/WalletSelect2";

import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { currentWalletAddress } = storeToRefs(vaultStore);

const newWalletMnemonic = ref("");
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
