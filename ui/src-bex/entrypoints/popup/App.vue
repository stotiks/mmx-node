<template>
    <q-layout view="hHh lpR fFf">
        <q-page-container>
            <!-- <div style="padding-top: 66px">
                {{ showContent }}
            </div> -->
            <template v-if="showContent">
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

            <q-inner-loading :showing="!showContent || isUnlockPending || isInitPending" class="fullscreen">
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

import { useVaultStatusQuery } from "@bex/entrypoints/popup/queries/vaultQueries";
import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";

const vaultStore = useVaultStore();
const { isActionRunning } = storeToRefs(vaultStore);

const { isInitialized, isUnlocked, isLoading } = useVaultStatusQuery();

// Track mutation states for loading indicator
import { useUnlockMutation } from "@bex/entrypoints/popup/queries/vaultMutations";
import { useInitVaultMutation } from "@bex/entrypoints/popup/queries/vaultMutations";
const unlockMutation = useUnlockMutation();
const initMutation = useInitVaultMutation();
const isUnlockPending = unlockMutation.isPending;
const isInitPending = initMutation.isPending;

import { useVaultMessageHandler } from "@bex/entrypoints/popup/MessageHandlers/useVaultMessageHandler";
useVaultMessageHandler();

import { useNotificationMessageHandler } from "./MessageHandlers/useNotificationMessageHandler";
const { isMounted, isRunning, isLoading: isNotificationLoading } = useNotificationMessageHandler();

const showContent = computed(() => {
    return (
        !isLoading.value &&
        //&& !isActionRunning.value
        isMounted.value &&
        !isNotificationLoading.value &&
        !isRunning.value
    );
});
</script>
