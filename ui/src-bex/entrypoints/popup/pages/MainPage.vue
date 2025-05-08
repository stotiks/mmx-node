<template>
    <q-page padding>
        <div class="q-gutter-y-sm">
            <q-list bordered class="rounded-borders">
                <q-expansion-item
                    label="Password update"
                    header-class="text-h6"
                    expand-separator
                    group="expansionGroup"
                >
                    <q-input v-model="password" type="password" label="Password" filled dense />
                    <q-input v-model="newPassword" type="password" label="New password" filled dense />
                    <q-btn @click="handleUpdatePasswordAsync">Update</q-btn>
                </q-expansion-item>

                <q-expansion-item label="Add wallet" header-class="text-h6" expand-separator group="expansionGroup">
                    <q-input v-model="newWalletMnemonic" label="Mnemonic" filled dense />
                    <q-input v-model="newWalletPassword" label="Password" filled dense />
                    <q-btn @click="handleAddWalletAsync">Add</q-btn>
                </q-expansion-item>
            </q-list>
            <WalletSelect2 />
            <q-btn :disabled="currentWalletAddress === ''" @click="handleRemoveWalletAsync(currentWalletAddress)">
                Remove
            </q-btn>
        </div>
    </q-page>
</template>

<script setup>
import WalletSelect2 from "@bex/entrypoints/popup/components/WalletSelect2";

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { currentWalletAddress } = storeToRefs(vaultStore);

const password = ref("password");
const newPassword = ref("password");

import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();

const handleUpdatePasswordAsync = async () => {
    await tryCatchWrapperAsync(() =>
        vaultStore.updatePasswordAsync({ password: password.value, newPassword: newPassword.value })
    );
};

const newWalletMnemonic = ref("");

const newWalletPassword = ref("");
const handleAddWalletAsync = async () => {
    await tryCatchWrapperAsync(() =>
        vaultStore.addWalletAsync({ mnemonic: newWalletMnemonic.value, password: newWalletPassword.value })
    );
};

const handleRemoveWalletAsync = async (address) => {
    await tryCatchWrapperAsync(() => vaultStore.removeWalletAsync({ address }));
};

import { useVaultMessageHandler } from "@bex/entrypoints/popup/MessageHandlers/useVaultMessageHandler";
useVaultMessageHandler();
</script>
