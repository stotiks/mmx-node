<template>
    <q-layout view="hHh lpR fFf">
        <!-- <q-header elevated>
            <q-bar>
                <q-btn dense flat :icon="mdiAlphaFBox" />
                <div class="text-weight-bold">Furry Vault</div>
            </q-bar>
        </q-header> -->
        <q-page-container>
            <q-inner-loading :showing="isLoading">
                <q-spinner-radio size="50px" color="primary" />
            </q-inner-loading>
            <template v-if="!isLoading">
                <template v-if="isUnlocked !== true">
                    <UnlockPage />
                </template>
                <q-page v-else padding style="padding-top: 66px">
                    <div class="q-gutter-y-sm">
                        <q-list bordered class="rounded-borders">
                            <q-expansion-item
                                label="Password update"
                                header-class="text-h6"
                                expand-separator
                                group="expansionGroup"
                            >
                                <q-input v-model="password" type="password" label="Password" filled dense />
                                <q-input v-model="newPassword" type="password" label="New password" filled dense />
                                <q-btn @click="handleUpdatePasswordAsync">Update</q-btn>
                            </q-expansion-item>

                            <q-expansion-item
                                label="Add wallet"
                                header-class="text-h6"
                                expand-separator
                                group="expansionGroup"
                            >
                                <q-input v-model="newWalletMnemonic" label="Mnemonic" filled dense />
                                <q-input v-model="newWalletPassword" label="Password" filled dense />
                                <q-btn @click="handleAddWalletAsync">Add</q-btn>
                            </q-expansion-item>
                        </q-list>
                        <WalletSelect2 />
                        <q-btn
                            :disabled="currentWalletAddress === ''"
                            @click="handleRemoveWalletAsync(currentWalletAddress)"
                        >
                            Remove
                        </q-btn>
                    </div>

                    <q-page-sticky expand position="top">
                        <q-toolbar class1="bg-primary text-white">
                            <!-- <q-toolbar-title class="text-subtitle1"> </q-toolbar-title> -->
                            <q-space />
                            <q-btn label="Lock" :icon="mdiLock" flat @click="handleLockAsync" />
                        </q-toolbar>
                    </q-page-sticky>
                </q-page>
            </template>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import UnlockPage from "@bex/entrypoints/popup/components/UnlockPage";
import WalletSelect2 from "@bex/entrypoints/popup/components/WalletSelect2";

import { mdiAlphaFBox, mdiLock } from "@mdi/js";

const password = ref("password");
const newPassword = ref("password");

import { useTryCatchWrapperAsync } from "./utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { isUnlocked, currentWalletAddress } = storeToRefs(vaultStore);

const handleUnlockAsync = async () => {
    await tryCatchWrapperAsync(() => vaultStore.unlockAsync({ password: password.value }));
};

const handleLockAsync = async () => {
    await tryCatchWrapperAsync(() => vaultStore.lockAsync());
};

const handleUpdatePasswordAsync = async () => {
    await tryCatchWrapperAsync(() =>
        vaultStore.updatePasswordAsync({ password: password.value, newPassword: newPassword.value })
    );
};

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

import { useVaultMessageHandler } from "@bex/entrypoints/popup/MessageHandlers/useVaultMessageHandler";
useVaultMessageHandler();

import { useNotificationMessageHandler } from "./MessageHandlers/useNotificationMessageHandler";
const { isLoading } = useNotificationMessageHandler();
</script>
