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
                :loading="unlockMutation.isPending.value"
            />
        </div>
    </q-form>
</template>

<script setup>
import { mdiLockOpenVariant, mdiShieldLockOpen } from "@mdi/js";
import WPasswordInput from "@/components/UI/WPasswordInput.vue";
import { useUnlockMutation } from "@bex/entrypoints/popup/queries/vaultMutations";
import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/composables/useTryCatchWrapperAsync";

const test_password = import.meta.env.DEV && import.meta.env.VITE_TEST_PASSWORD;
const password = ref(test_password || "");

const tryCatchWrapperAsync = useTryCatchWrapperAsync();
const unlockMutation = useUnlockMutation();

const handleUnlockAsync = async () => {
    await tryCatchWrapperAsync(() => unlockMutation.mutateAsync({ password: password.value }));
};
</script>
