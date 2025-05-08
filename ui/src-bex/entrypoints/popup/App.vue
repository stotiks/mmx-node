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
                <template v-else>
                    <RouterView style="padding-top: 66px" />

                    <q-page-sticky expand position="top">
                        <q-toolbar>
                            <q-space />
                            <q-btn flat :icon="mdiDotsVertical">
                                <q-menu anchor="bottom left" self="top left">
                                    <q-item clickable v-ripple to="/wallets">
                                        <q-item-section avatar>
                                            <q-icon :name="mdiWallet" />
                                        </q-item-section>
                                        <q-item-section>Wallets</q-item-section>
                                    </q-item>
                                    <q-item clickable v-ripple to="/password">
                                        <q-item-section avatar>
                                            <q-icon :name="mdiShieldLock" />
                                        </q-item-section>
                                        <q-item-section>Password</q-item-section>
                                    </q-item>
                                    <q-separator />
                                    <q-item clickable v-ripple @click="handleLockAsync">
                                        <q-item-section avatar>
                                            <q-icon :name="mdiLock" />
                                        </q-item-section>
                                        <q-item-section>Lock</q-item-section>
                                    </q-item>
                                </q-menu>
                            </q-btn>
                        </q-toolbar>
                    </q-page-sticky>
                </template>
            </template>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { mdiAlphaFBox, mdiLock, mdiDotsVertical, mdiWallet, mdiShieldLock } from "@mdi/js";

import MainPage from "@bex/entrypoints/popup/pages/MainPage";
import UnlockPage from "@bex/entrypoints/popup/pages/UnlockPage";

import { useTryCatchWrapperAsync } from "./utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { isUnlocked } = storeToRefs(vaultStore);

const handleLockAsync = async () => {
    await tryCatchWrapperAsync(() => vaultStore.lockAsync());
};

import { useNotificationMessageHandler } from "./MessageHandlers/useNotificationMessageHandler";
const { isLoading } = useNotificationMessageHandler();
</script>
