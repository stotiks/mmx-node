<template>
    <q-layout view="hHh lpR fFf">
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
                                    <q-item v-ripple clickable to="/wallets">
                                        <q-item-section avatar>
                                            <q-icon :name="mdiWallet" />
                                        </q-item-section>
                                        <q-item-section>Wallets</q-item-section>
                                    </q-item>
                                    <q-item v-ripple clickable to="/password">
                                        <q-item-section avatar>
                                            <q-icon :name="mdiShieldLock" />
                                        </q-item-section>
                                        <q-item-section>Password</q-item-section>
                                    </q-item>
                                    <q-separator />
                                    <q-item v-ripple clickable @click="handleLockAsync">
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

    <!-- <VueQueryDevtools /> -->
</template>

<script setup>
import { mdiAlphaFBox, mdiLock, mdiDotsVertical, mdiWallet, mdiShieldLock, mdiArrowLeft } from "@mdi/js";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";

import { useRoute } from "vue-router";
const route = useRoute();

import UnlockPage from "@bex/entrypoints/popup/pages/UnlockPage";

import { useTryCatchWrapperAsync } from "./utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { isUnlocked } = storeToRefs(vaultStore);

const handleLockAsync = async () => {
    await tryCatchWrapperAsync(() => vaultStore.lockAsync());
};

import { useVaultMessageHandler } from "@bex/entrypoints/popup/MessageHandlers/useVaultMessageHandler";
useVaultMessageHandler();

import { useNotificationMessageHandler } from "./MessageHandlers/useNotificationMessageHandler";
const { isLoading } = useNotificationMessageHandler();
</script>
