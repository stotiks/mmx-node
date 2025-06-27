<template>
    <q-page padding>
        <div class="q-gutter-y-md">
            <q-list bordered separator>
                <q-item-label header>Wallets</q-item-label>

                <q-item v-for="wallet in wallets" :key="wallet.address">
                    <!-- <q-item-section avatar>
                        <q-radio v-model="currentWalletAddress" :val="wallet.address" />
                    </q-item-section> -->
                    <q-item-section>
                        <q-item-label>{{ getShortAddr(wallet.address, 25) }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <div class="row">
                            <UseClipboard v-slot="{ copy: copyX, copied }">
                                <q-btn
                                    flat
                                    dense
                                    round
                                    :icon="copied ? mdiCheck : mdiContentCopy"
                                    @click.stop="copyX(wallet.address)"
                                >
                                    <q-tooltip :model-value="copied === true" no-parent-event>Copied!</q-tooltip>
                                </q-btn>
                            </UseClipboard>
                            <q-btn
                                flat
                                dense
                                round
                                :icon="mdiDelete"
                                @click.stop="handleRemoveWalletAsync(wallet.address)"
                            />
                        </div>
                    </q-item-section>
                </q-item>

                <q-item v-if="!wallets.length">
                    <q-item-section class="text-center">
                        <q-item-label>No wallets found.</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>

            <q-btn flat color="primary" @click="handleAddWallet()"> Add Wallet </q-btn>
        </div>
    </q-page>
</template>

<script setup>
import { mdiCheck, mdiContentCopy, mdiDelete } from "@mdi/js";

import { UseClipboard } from "@vueuse/components";
import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/utils/useTryCatchWrapperAsync";
import AddWalletDialog from "@bex/entrypoints/popup/components/dialogs/AddWalletDialog";

const tryCatchWrapperAsync = useTryCatchWrapperAsync();

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { wallets, currentWalletAddress } = storeToRefs(vaultStore);

const $q = useQuasar();
const handleAddWallet = () => {
    $q.dialog({
        component: defineAsyncComponent(() => import("@bex/entrypoints/popup/components/dialogs/AddWalletDialog")),
        componentProps: {},
    }).onOk(() => {});
};

const handleRemoveWalletAsync = async (address) => {
    await tryCatchWrapperAsync(() => vaultStore.removeWalletAsync({ address }));
};
</script>
