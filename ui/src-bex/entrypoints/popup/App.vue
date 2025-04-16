<template>
    <q-layout view="hHh lpR fFf">
        <!-- <q-header elevated>
            <q-bar>
                <q-btn dense flat :icon="mdiAlphaFBox" />
                <div class="text-weight-bold">Furry Vault</div>
            </q-bar>
        </q-header> -->
        <q-page-container>
            <q-page padding>
                <template v-if="isLocked">
                    Vault is locked
                    <q-input v-model="password" type="password" label="Password" filled dense />
                    <q-btn @click="handleUnlockAsync">Unlock</q-btn>
                </template>
                <template v-else>
                    <div class="q-gutter-y-sm">
                        <q-btn @click="handleLockAsync">Lock</q-btn>
                        <q-input v-model="password" type="password" label="Password" filled dense />
                        <q-input v-model="newPassword" type="password" label="Password" filled dense />
                        <q-btn @click="handleUpdatePasswordAsync">Update</q-btn>
                        <template v-for="account in accounts" :key="account">
                            <div>
                                <m-chip copy>{{ account }}</m-chip>
                            </div>
                        </template>
                    </div>
                </template>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { mdiAlphaFBox } from "@mdi/js";

const password = ref("password");
const newPassword = ref("password");

const $q = useQuasar();
const tryCatchWrapper = async (fn) => {
    try {
        return await fn();
    } catch (error) {
        $q.notify({ type: "negative", message: error.message });
    }
};

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault.js";
const vaultStore = useVaultStore();
const { isLocked, accounts } = storeToRefs(vaultStore);

const handleUnlockAsync = async () => {
    await tryCatchWrapper(() => vaultStore.unlockAsync(password.value));
};

const handleLockAsync = async () => {
    await tryCatchWrapper(() => vaultStore.lockAsync());
};

const handleUpdatePasswordAsync = async () => {
    await tryCatchWrapper(() => vaultStore.updatePasswordAsync(password.value, newPassword.value));
};

import { useVaultMessageHandler } from "@bex/entrypoints/popup/composables/useVaultMessageHandler";
useVaultMessageHandler();
</script>
