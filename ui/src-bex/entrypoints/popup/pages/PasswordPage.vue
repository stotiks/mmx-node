<template>
    <q-page padding>
        <q-card flat>
            <q-card-section class="q-gutter-y-sm">
                <div>Update password</div>
                <q-input
                    v-model="password"
                    type="password"
                    label="Old password"
                    filled
                    dense
                    :rules="[rules.required]"
                />

                <q-input
                    v-model="newPassword"
                    type="password"
                    label="New password"
                    filled
                    dense
                    :rules="[rules.required]"
                />
                <q-input
                    v-model="newPasswordConfirm"
                    type="password"
                    label="Confirm new password"
                    filled
                    dense
                    :rules="[rules.required, passwordMatch]"
                />
                <q-btn flat @click="handleUpdatePasswordAsync">Update</q-btn>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import rules from "@/helpers/rules";
const passwordMatch = (v) => v === newPassword.value || "Passwords do not match.";

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
</script>
