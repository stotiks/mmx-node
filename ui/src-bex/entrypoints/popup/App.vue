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
                    <q-btn @click="handleUnlock">Unlock</q-btn>
                </template>
                <template v-else>
                    <q-btn @click="handleLock">Lock</q-btn>
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
const sendMessage = async (payload) => {
    try {
        return await internalMessenger.sendMessage("notification", payload);
    } catch (error) {
        $q.notify({ type: "negative", message: error.message });
    }
};

const handleUnlock = async () => {
    await sendMessage({ method: "unlockVault", params: { password: password.value } });
};

const handleLock = async () => {
    await sendMessage({ method: "lockVault" });
};

const accounts = ref([]);
const isVaultLocked = ref(true);
onMounted(async () => {
    isVaultLocked.value = await sendMessage({ method: "isVaultLocked" });
    if (!isVaultLocked.value) {
        accounts.value = await sendMessage({ method: "getWalletsAddresses" });
    }
});

internalMessenger.onMessage("vault-unlock", (message) => {
    isVaultLocked.value = false;
    $q.notify({ type: "positive", message: "Vault is unlocked" });
});

internalMessenger.onMessage("vault-lock", (message) => {
    isVaultLocked.value = true;
    $q.notify({ type: "positive", message: "Vault is locked" });
});

internalMessenger.onMessage("wallets-loaded", async (message) => {
    accounts.value = await sendMessage({ method: "getWalletsAddresses" });
});
</script>
