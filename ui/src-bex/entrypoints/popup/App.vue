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
                <template v-if="isVaultLocked">
                    Vault is locked

                    <q-input v-model="password" type="password" label="Password" filled dense />
                    <q-btn @click="doRequest({ method: 'unlockVault', params: password })">Unlock</q-btn>
                </template>
                <template v-else>
                    <template v-for="account in accounts" :key="account">
                        <div>
                            <m-chip copy>{{ account }}</m-chip>
                        </div>
                    </template>
                </template>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { mdiAlphaFBox } from "@mdi/js";

const password = ref("password");

const $q = useQuasar();
import { internalMessenger } from "@bex/messaging/popup";
const doRequest = async (payload) => {
    try {
        return await internalMessenger.sendMessage("notification", payload);
    } catch (error) {
        $q.notify({ type: "negative", message: error.message });
    }
};

const isVaultLocked = computedAsync(() => doRequest({ method: "isVaultLocked" }), false);
const accounts = computedAsync(async () => await doRequest({ method: "getWalletsAddresses" }), []);
</script>
