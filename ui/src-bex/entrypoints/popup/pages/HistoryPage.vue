<template>
    <q-page padding style="padding-top: 66px">
        <h1 class="text-h5">History</h1>
        <q-card flat>
            <q-list bordered separator>
                <q-item v-for="(item, index) in history" :key="index">
                    <q-item-section>
                        <q-item-label>{{ item.method }}</q-item-label>
                        <q-item-label caption>{{ new Date(item.time).toLocaleString() }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item v-if="!history || !history.length">
                    <q-item-section class="text-center">
                        <q-item-label>No history yet.</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-card>
    </q-page>
</template>

<script setup>
import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { history } = storeToRefs(vaultStore);
</script>
