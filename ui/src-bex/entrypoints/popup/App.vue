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
                <template v-for="account in accounts" :key="account">
                    <div>
                        <m-chip copy>{{ account }}</m-chip>
                    </div>
                </template>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { mdiAlphaFBox } from "@mdi/js";

import { internalMessenger } from "@bex/utils/internalMessenger";
const accounts = computedAsync(
    async () => await internalMessenger.sendMessage("request", { method: "mmx_requestAccounts" }),
    null,
    {
        onError: (error) => {
            throw error;
        },
    }
);
</script>
