<template>
    <q-page padding>
        <q-card flat>
            <q-card-section class="q-gutter-y-sm">
                <div>Update password</div>
                <q-form class="q-gutter-y-sm" @submit="handleUpdatePasswordAsync" @reset="handleReset">
                    <WPasswordInput
                        v-model="password"
                        label="Old password"
                        filled
                        dense
                        hide-bottom-space
                        :rules="[rules.required]"
                    />

                    <div class="text-caption">
                        Password must contain at least:
                        <ul style="list-style-type: none; padding-left: 0">
                            <li
                                v-for="(rule, index) in passwordRules"
                                :key="index"
                                :class="{ 'text-positive': rule.valid }"
                            >
                                <q-icon :name="rule.valid ? mdiCheck : mdiClose" />
                                {{ rule.label }}
                            </li>
                        </ul>
                    </div>
                    <WPasswordInput
                        v-model="newPassword"
                        label="New password"
                        filled
                        dense
                        hide-bottom-space
                        :rules="[rules.required, passwordRule]"
                        class="q-mt-md"
                    />
                    <WPasswordInput
                        v-model="newPasswordConfirm"
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
import { mdiCheck, mdiClose } from "@mdi/js";
import WPasswordInput from "@/components/UI/WPasswordInput.vue";

import rules from "@/helpers/rules";
const match = (value, message) => (v) => v === value || message;

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();

import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();

const test_password = process.env.NODE_ENV === "development" && import.meta.env.VITE_TEST_PASSWORD;
const password = ref(test_password || "");
const newPassword = ref(test_password || "");
const newPasswordConfirm = ref(test_password || "");

const passwordRules = computed(() => {
    const value = newPassword.value;
    return [
        {
            label: "12 characters",
            valid: value.length >= 12,
            message: "Password must be at least 12 characters long",
        },
        {
            label: "one digit",
            valid: /\d/.test(value),
            message: "Password must contain at least one digit",
        },
        {
            label: "one lowercase letter",
            valid: /[a-z]/.test(value),
            message: "Password must contain at least one lowercase letter",
        },
        {
            label: "one uppercase letter",
            valid: /[A-Z]/.test(value),
            message: "Password must contain at least one uppercase letter",
        },
        {
            label: "one special character",
            valid: /[!@#$%^&*(),.?":{}|<>]/.test(value),
            message: "Password must contain at least one special character",
        },
    ];
});

const passwordRule = (value) => {
    for (const rule of passwordRules.value) {
        if (!rule.valid) {
            return rule.message;
        }
    }
    return true;
};

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
