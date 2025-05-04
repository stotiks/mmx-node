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
        <q-card class="q-dialog-plugin">
            <q-layout view="lHh Lpr lFf">
                <q-page-container>
                    <UnlockPage v-if="isUnlocked !== true" />
                    <q-page v-else padding style="padding-top: 66px">
                        <div>
                            {{ url }}
                            {{ isUnlocked }}
                            {{ props.data }}
                        </div>

                        <q-page-sticky expand position="top">
                            <q-toolbar class="bg-primary text-white">
                                <q-toolbar-title class="text-subtitle1">
                                    <b>Accept request: {{ props.data.method }}</b>
                                </q-toolbar-title>
                            </q-toolbar>
                        </q-page-sticky>

                        <q-page-sticky expand position="bottom" class="q-pa-md">
                            <div class="col">
                                <div class="row justify-between q-gutter-x-sm">
                                    <q-btn
                                        label="Accept"
                                        :icon="mdiCheck"
                                        outline
                                        rounded
                                        color="positive"
                                        @click="handleAccept"
                                    />

                                    <q-btn
                                        label="Reject"
                                        :icon="mdiClose"
                                        outline
                                        rounded
                                        color="negative"
                                        @click="handleReject"
                                    />
                                </div>
                            </div>
                        </q-page-sticky>
                    </q-page>
                </q-page-container>
            </q-layout>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { mdiCheck, mdiClose } from "@mdi/js";
import UnlockPage from "./pages/UnlockPage.vue";

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

import { useVaultStore } from "../../../stores/vault";
const vaultStore = useVaultStore();
const { isUnlocked } = storeToRefs(vaultStore);

const handleReject = () => {
    onDialogCancel();
};

import { vaultService } from "../../../vaultService";

import { useTryCatchWrapper } from "@bex/entrypoints/popup/utils/useTryCatchWrapper";
const tryCatchWrapper = useTryCatchWrapper();
const handleAccept = async () => {
    tryCatchWrapper(async () => await vaultService.allowUrlAsync(props.url)); // TODO move to vaultStore
    onDialogOK({ accepted: true });
};
</script>
