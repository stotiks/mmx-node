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

                        <WPasswordInput
                            v-model="newPassword"
                            label="New password"
                            filled
                            dense
                            hide-bottom-space
                            :rules="[rules.required, passwordRule]"
                        />

                        <!-- <div class="text-caption q-gutter-xs">
                            <div
                                v-for="(rule, index) in passwordRules"
                                :key="index"
                                :class="['row', 'items-center', { 'text-positive': rule.valid }]"
                            >
                                <q-icon size="xs" :name="rule.valid ? mdiCheck : mdiClose" />
                                <div>{{ rule.label }}</div>
                            </div>
                        </div> -->

                        <WPasswordInput
                            v-model="newPasswordConfirm"
                            label="Confirm new password"
                            filled
                            dense
                            hide-bottom-space
                            reactive-rules
                            :rules="[rules.required, match(newPassword, 'Passwords do not match.')]"
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
