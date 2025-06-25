<template>
    <WPasswordInput
        v-model="newPassword"
        label="New password"
        filled
        dense
        hide-bottom-space
        reactive-rules
        :rules="[rules.required, passwordRule]"
    />

    <div class="text-caption q-gutter-xs">
        <div
            v-for="(rule, index) in passwordRules"
            :key="index"
            :class="['row', 'items-center', { 'text-positive': rule.valid }]"
        >
            <q-icon size="xs" :name="rule.valid ? mdiCheck : mdiClose" />
            <div>{{ rule.label }}</div>
        </div>
    </div>

    <WPasswordInput
        v-model="newPasswordConfirm"
        label="Confirm new password"
        filled
        dense
        hide-bottom-space
        reactive-rules
        :rules="[rules.required, matchRule]"
    />
</template>

<script setup>
import { mdiCheck, mdiClose } from "@mdi/js";
import rules from "@/helpers/rules";

import WPasswordInput from "@/components/UI/WPasswordInput.vue";

const newPassword = defineModel("newPassword", { type: String });
const newPasswordConfirm = defineModel("newPasswordConfirm", { type: String });

const matchRule = computed(() => (v) => v === newPassword.value || "Passwords do not match.");

const passwordRules = computed(() => {
    const value = newPassword.value || "";
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
</script>
