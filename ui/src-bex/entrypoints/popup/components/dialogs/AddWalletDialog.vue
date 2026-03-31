<template>
    <q-dialog ref="dialogRef" persistent @show="onDialogShow" @hide="onDialogHide">
        <q-card class="q-dialog-plugin" style="min-width: 350px">
            <q-form ref="formRef" @submit="handleSubmit">
                <q-card-section class="q-pt-none q-gutter-y-sm">
                    <SeedInput v-model="mnemonic" :debounce="200" dense />
                    <q-input v-model="password" label="Password" dense outlined type="password" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" @click="onDialogCancel" />
                    <q-btn flat label="Add" type="submit" :loading="addMutation.isPending.value" />
                </q-card-actions>
            </q-form>

            <q-inner-loading :showing="addMutation.isPending.value">
                <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/composables/useTryCatchWrapperAsync";
import { useAddWalletMutation } from "@bex/entrypoints/popup/queries/vaultMutations";

defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const test_mnemonic = import.meta.env.DEV && import.meta.env.VITE_TEST_MNEMONIC;
const mnemonic = ref(test_mnemonic || "");
const password = ref("");

const tryCatchWrapperAsync = useTryCatchWrapperAsync();
const addMutation = useAddWalletMutation();

const handleSubmit = async () => {
    await tryCatchWrapperAsync(async () => {
        await addMutation.mutateAsync({ mnemonic: mnemonic.value, password: password.value });
        mnemonic.value = ""; // Clear mnemonic from memory after successful wallet addition
        onDialogOK();
    });
};
</script>
