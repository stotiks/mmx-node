<template>
    <q-layout view="hHh lpR fFf">
        <q-page-container>
            <q-inner-loading :showing="!isMounted">
                <q-spinner-radio size="50px" color="primary" />
            </q-inner-loading>

            <template v-if="isMounted">
                <template v-if="isUnlocked !== true">
                    <UnlockPage />
                </template>
                <template v-else>
                    <RouterView style="padding-top: 66px" />
                    <q-inner-loading :showing="isActionRunning">
                        <q-spinner-gears size="50px" color="primary" />
                    </q-inner-loading>
                    <Toolbar />
                </template>
            </template>
        </q-page-container>
    </q-layout>

    <!-- <VueQueryDevtools /> -->
</template>

<script setup>
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";

import UnlockPage from "@bex/entrypoints/popup/pages/UnlockPage";
import Toolbar from "./components/Toolbar.vue";

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { isInitialized, isUnlocked } = storeToRefs(vaultStore);

import { useVaultMessageHandler } from "@bex/entrypoints/popup/MessageHandlers/useVaultMessageHandler";
useVaultMessageHandler();

import { useNotificationMessageHandler } from "./MessageHandlers/useNotificationMessageHandler";
const { isMounted } = useNotificationMessageHandler();
</script>
