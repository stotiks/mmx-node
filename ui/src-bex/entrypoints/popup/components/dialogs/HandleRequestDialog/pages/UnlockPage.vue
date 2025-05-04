<template>
    <q-page padding style="padding-top: 66px">
        <div class="fullscreen row justify-center">
            <q-card flat class="self-center col-xl-4 col-lg-6 col-md-8 col-sm-10 col-xs-10">
                <q-toolbar>
                    <q-toolbar-title>
                        <div class="row justify-center">Unlock</div>
                    </q-toolbar-title>
                </q-toolbar>
                <q-card-section>
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
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/utils/useTryCatchWrapperAsync";
import { mdiLockOpenVariant, mdiShieldLockOpen, mdiLogin } from "@mdi/js";

const password = ref("");

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();

const tryCatchWrapperAsync = useTryCatchWrapperAsync();
const handleUnlockAsync = async () => {
    await tryCatchWrapperAsync(() => vaultStore.unlockAsync({ password: password.value }));
};
</script>
