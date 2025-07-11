<template>
    <q-page-sticky expand position="top">
        <q-toolbar>
            <template v-if="route.path !== '/'">
                <q-btn flat :icon="mdiArrowLeft" :to="{ name: 'home' }" />
            </template>
            <q-space />
            <q-btn flat :icon="mdiDotsVertical">
                <q-menu anchor="bottom left" self="top left">
                    <q-item v-ripple clickable to="/history">
                        <q-item-section avatar>
                            <q-icon :name="mdiHistory" />
                        </q-item-section>
                        <q-item-section>History</q-item-section>
                    </q-item>
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
                            <q-icon :name="mdiLock" color="warning" />
                        </q-item-section>
                        <q-item-section class="text-warning"> Lock </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item v-ripple clickable @click="handleRemoveVaultDataAsync">
                        <q-item-section avatar>
                            <q-icon :name="mdiTrashCanOutline" color="negative" />
                        </q-item-section>
                        <q-item-section class="text-negative text-no-wrap"> Remove Vault Data </q-item-section>
                    </q-item>
                </q-menu>
            </q-btn>
        </q-toolbar>
    </q-page-sticky>
</template>

<script setup>
import {
    mdiLock,
    mdiDotsVertical,
    mdiWallet,
    mdiShieldLock,
    mdiArrowLeft,
    mdiTrashCanOutline,
    mdiHistory,
} from "@mdi/js";

const route = useRoute();

import { useVaultStore } from "../stores/vault";
const vaultStore = useVaultStore();

import { useTryCatchWrapperAsync } from "../utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();

import { useRemoveVaultData } from "../utils/useRemoveVaultData";
const { handleRemoveVaultDataAsync } = useRemoveVaultData();

const handleLockAsync = async () => {
    await tryCatchWrapperAsync(() => vaultStore.lockAsync());
};
</script>
