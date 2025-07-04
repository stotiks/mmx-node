<template>
    <q-page padding style="padding-top: 66px">
        <div class="row justify-center">
            <q-card flat class="self-center col-xl-4 col-lg-6 col-md-8 col-sm-10 col-xs-10">
                <q-card-section class="q-gutter-y-sm">
                    <div class="text-h6 text-center">Update password</div>
                    <q-form class="q-gutter-y-md" @submit="handleUpdatePasswordAsync" @reset="handleReset">
                        <WPasswordInput
                            v-model="password"
                            label="Old password"
                            filled
                            dense
                            hide-bottom-space
                            :rules="[rules.required]"
                        />

                        <PasswordForm
                            v-model:new-password="newPassword"
                            v-model:new-password-confirm="newPasswordConfirm"
                        />
                        <div class="row justify-between">
                            <q-btn label="Reset" type="reset" color="primary" flat />
                            <q-btn label="Update" type="submit" color="primary" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import WPasswordInput from "@/components/UI/WPasswordInput.vue";
import PasswordForm from "@bex/entrypoints/popup/components/PasswordForm.vue";
import rules from "@/helpers/rules";

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();

import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();

const test_password = process.env.NODE_ENV === "development" && import.meta.env.VITE_TEST_PASSWORD;
const password = ref(test_password || "");
const newPassword = ref(test_password || "");
const newPasswordConfirm = ref(test_password || "");

const handleUpdatePasswordAsync = async () => {
    await tryCatchWrapperAsync(() =>
        vaultStore.updatePasswordAsync({ password: password.value, newPassword: newPassword.value })
    );
};

const handleReset = () => {
    password.value = "";
    newPassword.value = "";
    newPasswordConfirm.value = "";
};
</script>
