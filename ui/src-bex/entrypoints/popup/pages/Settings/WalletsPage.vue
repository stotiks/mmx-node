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
                                :loading="removeMutation.isPending.value"
                                @click.stop="handleRemoveWalletAsync(wallet.address)"
                            />
                        </div>
                    </q-item-section>
                </q-item>

                <q-item v-if="!wallets || !wallets.length">
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
import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/composables/useTryCatchWrapperAsync";
import { useWalletsQuery, useIsUnlockedQuery } from "@bex/entrypoints/popup/queries/vaultQueries";
import { useRemoveWalletMutation } from "@bex/entrypoints/popup/queries/vaultMutations";

const tryCatchWrapperAsync = useTryCatchWrapperAsync();

const { data: isUnlocked } = useIsUnlockedQuery();
const { data: wallets } = useWalletsQuery();
const removeMutation = useRemoveWalletMutation();

const $q = useQuasar();
const handleAddWallet = () => {
    $q.dialog({
        component: defineAsyncComponent(() => import("@bex/entrypoints/popup/components/dialogs/AddWalletDialog")),
        componentProps: {},
    }).onOk(() => {});
};

const handleRemoveWalletAsync = async (address) => {
    await tryCatchWrapperAsync(() => removeMutation.mutateAsync({ address }));
};
</script>
