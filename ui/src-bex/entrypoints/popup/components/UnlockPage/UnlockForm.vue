<template>
    <q-form class="q-gutter-sm" @submit="handleUnlockAsync">
        <q-input v-model="password" type="password" required filled label="Password">
            <template v-slot:prepend>
                <q-icon :name="mdiShieldLockOpen" />
            </template>
        </q-input>
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

const password = ref("");

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();

import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();
const handleUnlockAsync = async () => {
    await tryCatchWrapperAsync(() => vaultStore.unlockAsync({ password: password.value }));
};
</script>
