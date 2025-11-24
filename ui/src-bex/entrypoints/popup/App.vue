<template>
    <q-layout view="hHh lpR fFf">
        <q-page-container>
            <template v-if="isMounted && !isLoading">
                <template v-if="!isInitialized">
                    <InitPage />
                </template>
                <template v-else-if="!isUnlocked">
                    <UnlockPage />
                </template>
                <template v-else>
                    <RouterView style="padding-top: 66px" />
                    <Toolbar />
                </template>
            </template>

            <q-inner-loading :showing="!showContent || isRunning" class="fullscreen">
                <q-spinner-radio size="50px" color="primary" />
            </q-inner-loading>
        </q-page-container>
    </q-layout>

    <!-- <VueQueryDevtools /> -->
</template>

<script setup>
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";

import UnlockPage from "@bex/entrypoints/popup/pages/UnlockPage";
import InitPage from "@bex/entrypoints/popup/pages/InitPage.vue";
import Toolbar from "./components/Toolbar.vue";

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { isLoaded, isInitialized, isUnlocked, isActionRunning } = storeToRefs(vaultStore);

import { useVaultMessageHandler } from "@bex/entrypoints/popup/MessageHandlers/useVaultMessageHandler";
useVaultMessageHandler();

import { useNotificationMessageHandler } from "./MessageHandlers/useNotificationMessageHandler";
const { isMounted, isRunning, isLoading } = useNotificationMessageHandler();

const showContent = computed(() => {
    return isMounted.value && !isLoading.value;
});
</script>
