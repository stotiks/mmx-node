<template>
    <q-dialog ref="dialogRef" persistent @show="onDialogShow" @hide="onDialogHide">
        <q-card lass="q-dialog-plugin" style="min-width: 350px">
            <q-form ref="formRef" @submit="handleSubmit">
                <q-card-section>
                    <div class="text-h6">Add Wallet</div>
                </q-card-section>

                <q-card-section class="q-pt-none q-gutter-y-sm">
                    <q-input v-model="mnemonic" label="Mnemonic" filled dense />
                    <q-input v-model="password" label="Password" filled dense type="password" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" @click="onDialogCancel" />
                    <q-btn flat label="Add" type="submit" />
                </q-card-actions>
            </q-form>

            <q-inner-loading :showing="isActionRunning">
                <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
        </q-card>
    </q-dialog>
</template>

<script setup>
const props = defineProps({});

import { useDialogPluginComponent } from "quasar";
defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const test_mnemonic = process.env.NODE_ENV === "development" && import.meta.env.VITE_TEST_MNEMONIC;
const mnemonic = ref(test_mnemonic || "");
const password = ref("");

const handleSubmit = async () => {
    await handleAddWalletAsync();
    onDialogOK();
};
const onDialogShow = () => {};

import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/utils/useTryCatchWrapperAsync";
const tryCatchWrapperAsync = useTryCatchWrapperAsync();

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { isActionRunning } = storeToRefs(vaultStore);

const handleAddWalletAsync = async () => {
    await tryCatchWrapperAsync(async () => {
        await vaultStore.addWalletAsync({ mnemonic: mnemonic.value, password: password.value });
    });
};
</script>
