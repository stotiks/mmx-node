<template>
    <q-page padding>
        <div class="q-gutter-y-md">
            <q-list bordered separator>
                <q-item-label header>Wallets</q-item-label>

                <q-item v-for="wallet in wallets" :key="wallet.address" tag="label" v-ripple>
                    <!-- <q-item-section avatar>
                        <q-radio v-model="currentWalletAddress" :val="wallet.address" />
                    </q-item-section> -->
                    <q-item-section>
                        <q-item-label>{{ getShortAddr(wallet.address, 25) }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-btn
                            v-if="wallets.length > 1"
                            flat
                            dense
                            round
                            :icon="mdiDelete"
                            @click.stop="handleRemoveWalletAsync(wallet.address)"
                        />
                    </q-item-section>
                </q-item>

                <q-item v-if="!wallets.length">
                    <q-item-section class="text-center">
                        <q-item-label>No wallets found.</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>

            <q-expansion-item
                expand-separator
                :icon="mdiPlus"
                label="Add wallet"
                caption="Create a new wallet from mnemonic"
            >
                <q-card>
                    <q-card-section class="q-gutter-y-sm">
                        <q-input v-model="newWalletMnemonic" label="Mnemonic" filled dense />
                        <q-input v-model="newWalletPassword" label="Password" filled dense type="password" />
                        <q-btn flat @click="handleAddWalletAsync">Add</q-btn>
                    </q-card-section>
                </q-card>
            </q-expansion-item>
        </div>
    </q-page>
</template>

<script setup>
import { mdiDelete, mdiPlus } from "@mdi/js";
import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { wallets, currentWalletAddress } = storeToRefs(vaultStore);

const test_mnemonic = process.env.NODE_ENV === "development" && import.meta.env.VITE_TEST_MNEMONIC;
const newWalletMnemonic = ref(test_mnemonic || "");
const newWalletPassword = ref("");

const handleAddWalletAsync = async () => {
    await tryCatchWrapperAsync(async () => {
        await vaultStore.addWalletAsync({ mnemonic: newWalletMnemonic.value, password: newWalletPassword.value });
        newWalletMnemonic.value = test_mnemonic || "";
        newWalletPassword.value = "";
    });
};

const handleRemoveWalletAsync = async (address) => {
    await tryCatchWrapperAsync(() => vaultStore.removeWalletAsync({ address }));
};
</script>
