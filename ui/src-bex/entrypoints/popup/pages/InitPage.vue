<template>
    <div class="q-pa-md q-gutter-y-md">
        <q-form class="q-gutter-y-md" @submit="handleInitAsync" @reset="handleReset">
            <PasswordForm v-model:new-password="newPassword" v-model:new-password-confirm="newPasswordConfirm" />

            <div class="row justify-between">
                <q-btn label="Reset" type="reset" color="primary" flat />
                <q-btn label="Create" type="submit" color="primary" />
            </div>
        </q-form>
    </div>
</template>

<script setup>
import PasswordForm from "@bex/entrypoints/popup/components/PasswordForm.vue";
import WBtnSubmit from "@/components/Wallet/WalletForm/WBtnSubmit.vue";

import { useTryCatchWrapperAsync } from "../utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();

const newPassword = ref("");
const newPasswordConfirm = ref("");

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();

const handleInitAsync = async () => {
    await tryCatchWrapperAsync(async () => {
        await vaultStore.initVaultAsync({
            password: newPassword.value,
        });
    });
};

const handleReset = () => {
    newPassword.value = "";
    newPasswordConfirm.value = "";
};
</script>
