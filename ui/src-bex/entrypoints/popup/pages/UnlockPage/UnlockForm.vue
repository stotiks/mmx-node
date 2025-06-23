<template>
    <q-form class="q-gutter-sm" @submit="handleUnlockAsync">
        <WPasswordInput v-model="password" required filled label="Password">
            <template v-slot:prepend>
                <q-icon :name="mdiShieldLockOpen" />
            </template>
        </WPasswordInput>
        <div class="row justify-center">
            <q-btn
                label="Unlock"
                :icon="mdiLockOpenVariant"
                type="submit"
                :color="password ? 'positive' : 'primary'"
                rounded
                outline
                :disable="!password"
            />
        </div>
    </q-form>
</template>

<script setup>
import { mdiLockOpenVariant, mdiShieldLockOpen, mdiLogin } from "@mdi/js";
import WPasswordInput from "@/components/UI/WPasswordInput.vue";

const test_password = process.env.NODE_ENV === "development" && import.meta.env.VITE_TEST_PASSWORD;
const password = ref(test_password || "");

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();

import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();
const handleUnlockAsync = async () => {
    await tryCatchWrapperAsync(() => vaultStore.unlockAsync({ password: password.value }));
};
</script>
