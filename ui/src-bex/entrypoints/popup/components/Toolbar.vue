<template>
    <q-page-sticky expand position="top">
        <q-toolbar style="background: var(--q-dark-page)">
            <template v-if="route.path !== '/'">
                <q-btn flat :icon="mdiArrowLeft" :to="{ name: 'home' }" />
            </template>
            <q-space />
            <q-btn flat :icon="mdiDotsVertical">
                <q-menu anchor="bottom left" self="top left">
                    <template v-for="(item, index) in menuItems" :key="index">
                        <q-item v-if="!item.separator" v-ripple clickable :to="item.to" @click="item.onClick">
                            <q-item-section avatar>
                                <q-icon :name="item.icon" :color="item.color" />
                            </q-item-section>
                            <q-item-section
                                :class="[{ 'text-no-wrap': item.noWrap }, item.color && `text-${item.color}`]"
                            >
                                {{ item.label }}
                            </q-item-section>
                        </q-item>
                        <q-separator v-else />
                    </template>
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

import { useLockMutation } from "@bex/entrypoints/popup/queries/vaultMutations";
import { useTryCatchWrapperAsync } from "../composables/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();
const lockMutation = useLockMutation();

import { useRemoveVaultData } from "../composables/useRemoveVaultData";
const { handleRemoveVaultDataAsync } = useRemoveVaultData();

const handleLockAsync = async () => {
    await tryCatchWrapperAsync(() => lockMutation.mutateAsync());
};

const menuItems = [
    {
        to: "/wallets",
        icon: mdiWallet,
        label: "Wallets",
    },
    {
        to: "/history",
        icon: mdiHistory,
        label: "History",
    },
    {
        to: "/password",
        icon: mdiShieldLock,
        label: "Password",
    },
    { separator: true },
    {
        onClick: handleLockAsync,
        icon: mdiLock,
        label: "Lock",
        color: "warning",
    },
    { separator: true },
    {
        onClick: handleRemoveVaultDataAsync,
        icon: mdiTrashCanOutline,
        label: "Remove Vault Data",
        color: "negative",
        noWrap: true,
    },
];
</script>
