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
            <div class="column" style="height: 100vw">
                <q-toolbar class="bg-primary text-white">
                    <q-toolbar-title class="text-subtitle1">
                        <b>Accept request: {{ props.data.method }}</b>
                    </q-toolbar-title>
                </q-toolbar>
                <q-card-section class="col-9">
                    <div class="q-gutter-y-sm">
                        {{ isLocked }}
                        {{ props.data }}
                    </div>
                </q-card-section>

                <q-card-section class="q-mt-md col">
                    <div class="col">
                        <div class="row justify-between q-gutter-x-sm">
                            <q-btn :label="$t('market_offers.accept')" outline color="positive" @click="handleAccept" />
                            <q-btn label="Reject" outline color="negative" @click="handleReject" />
                        </div>
                    </div>
                </q-card-section>
            </div>
        </q-card>
    </q-dialog>
</template>

<script setup>
import rules from "@/helpers/rules";

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
const { isLocked } = storeToRefs(vaultStore);

const handleReject = () => {
    onDialogCancel();
};

import { vaultService } from "../../vaultService";
const handleAccept = async () => {
    await vaultService.allowUrlAsync(props.url);
    onDialogOK({ accepted: true });
};
</script>
