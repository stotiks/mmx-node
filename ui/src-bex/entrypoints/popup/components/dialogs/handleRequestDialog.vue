<template>
    <q-dialog
        ref="dialogRef"
        persistent
        maximized
        transition-show="slide-up"
        transition-hide="slide-down"
        @show="onDialogShow"
        @hide="onDialogHide"
    >
        <q-card class="q-dialog-plugin column">
            <div class="column" style="height: 100%">
                <q-toolbar class="bg-primary text-white col-1">
                    <q-toolbar-title class="text-subtitle1">
                        <b>Accept request: {{ props.data.method }}</b>
                    </q-toolbar-title>
                </q-toolbar>

                <q-card-section class="col-11 column">
                    <div class="col">
                        {{ url }}
                        {{ isUnlocked }}
                        {{ props.data }}
                    </div>
                    <div class="row justify-between q-gutter-x-sm col-1">
                        <q-btn label="Accept" :icon="mdiCheck" outline rounded color="positive" @click="handleAccept" />
                        <q-btn label="Reject" :icon="mdiClose" outline rounded color="negative" @click="handleReject" />
                    </div>
                </q-card-section>
            </div>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { mdiCheck, mdiClose } from "@mdi/js";

const props = defineProps({
    url: {
        type: Object,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
});

import { useDialogPluginComponent } from "quasar";
defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onDialogShow = async () => {};

import { useVaultStore } from "../../stores/vault";
const vaultStore = useVaultStore();
const { isUnlocked } = storeToRefs(vaultStore);

const handleReject = () => {
    onDialogCancel();
};

import { vaultService } from "../../vaultService";
const handleAccept = async () => {
    await vaultService.allowUrlAsync(props.url); // TODO move to vaultStore
    onDialogOK({ accepted: true });
};
</script>
