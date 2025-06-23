<template>
    <q-page padding>
        <q-card flat>
            <q-card-section class="q-gutter-y-sm">
                <div>Update password</div>
                <q-form class="q-gutter-y-sm" @submit="handleUpdatePasswordAsync" @reset="handleReset">
                    <q-input
                        v-model="password"
                        :type="showPassword ? 'text' : 'password'"
                        label="Old password"
                        filled
                        dense
                        hide-bottom-space
                        :rules="[rules.required]"
                    />

                    <q-input
                        v-model="newPassword"
                        type="password"
                        label="New password"
                        filled
                        dense
                        hide-bottom-space
                        :rules="[rules.required]"
                        class="q-mt-md"
                    />
                    <q-input
                        v-model="newPasswordConfirm"
                        type="password"
                        label="Confirm new password"
                        filled
                        dense
                        hide-bottom-space
                        reactive-rules
                        :rules="[rules.required, match(newPassword, 'Passwords do not match.')]"
                    />
                    <div>
                        <q-btn label="Update" type="submit" color="primary" />
                        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import rules from "@/helpers/rules";
const match = (value, message) => (v) => v === value || message;

const newPasswordConfirmRules = computed(() => {
    const np = newPassword.value;
    return [rules.required, (val) => val === np || "Passwords do not match"];
});

const passwordMatch = (v) => v === newPassword.value || "Passwords do not match.";

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();

import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();

const test_password = process.env.NODE_ENV === "development1" && import.meta.env.VITE_TEST_PASSWORD;
const password = ref(test_password || "");
const newPassword = ref(test_password || "");
const newPasswordConfirm = ref(test_password || "");

const showPassword = ref(false);
const toggleShowPassword = () => (showPassword.value = !showPassword.value);

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
