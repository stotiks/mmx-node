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
                    <div class="q-gutter-y-sm">
                        <q-btn @click="handleLock">Lock</q-btn>
                        <q-input v-model="password" type="password" label="Password" filled dense />
                        <q-input v-model="newPassword" type="password" label="Password" filled dense />
                        <q-btn @click="handlePasswordUpdate">Update</q-btn>
                        <template v-for="account in accounts" :key="account">
                            <div>
                                <m-chip copy>{{ account }}</m-chip>
                            </div>
                        </template>
                    </div>
                </template>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { mdiAlphaFBox } from "@mdi/js";

const password = ref("password");
const newPassword = ref("password");

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

const handlePasswordUpdate = async () => {
    await sendMessage({
        method: "updatePassword",
        params: { password: password.value, newPassword: newPassword.value },
    });
};

const accounts = ref([]);
const isVaultLocked = ref(true);
onMounted(async () => {
    isVaultLocked.value = await sendMessage({ method: "isVaultLocked" });
});

watchEffect(async () => {
    if (isVaultLocked.value) {
        accounts.value = [];
    } else {
        accounts.value = await sendMessage({ method: "getWalletsAddresses" });
    }
});

import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";
class VaultMessageHandler extends MessageHandlerBase {
    static unlocked = async () => {
        isVaultLocked.value = false;
        $q.notify({ type: "positive", message: "Vault is unlocked" });
    };

    static locked = async () => {
        isVaultLocked.value = true;
        $q.notify({ type: "positive", message: "Vault is locked" });
    };

    static walletsLoaded = async () => {
        accounts.value = await sendMessage({ method: "getWalletsAddresses" });
    };

    static passwordUpdated = async () => {
        $q.notify({ type: "positive", message: "Password updated" });
    };
}

internalMessenger.onMessage("vault", async (message) => {
    return await VaultMessageHandler.handle(message);
});
</script>
