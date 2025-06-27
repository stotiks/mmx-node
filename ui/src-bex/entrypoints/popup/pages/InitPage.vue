<template>
    <q-page padding style="padding-top: 66px">
        <div class="row justify-center">
            <q-card flat class="self-center col-xl-4 col-lg-6 col-md-8 col-sm-10 col-xs-10">
                <q-card-section class="q-gutter-y-sm">
                    <div class="text-h6 text-center">Create password</div>
                    <q-form class="q-gutter-y-md" @submit="handleInitAsync" @reset="handleReset">
                        <PasswordForm
                            v-model:new-password="newPassword"
                            v-model:new-password-confirm="newPasswordConfirm"
                        />

                        <div class="row justify-between">
                            <q-btn label="Reset" type="reset" color="primary" flat />
                            <q-btn label="Create" type="submit" color="primary" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import PasswordForm from "@bex/entrypoints/popup/components/PasswordForm.vue";
import WBtnSubmit from "@/components/Wallet/WalletForm/WBtnSubmit.vue";

import { useTryCatchWrapperAsync } from "../utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();

const test_password = process.env.NODE_ENV === "development" && import.meta.env.VITE_TEST_PASSWORD;
const newPassword = ref(test_password || "");
const newPasswordConfirm = ref(test_password || "");

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
