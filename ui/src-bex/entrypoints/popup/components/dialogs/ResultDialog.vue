<template>
    <q-dialog
        ref="dialogRef"
        persistent
        maximized
        transition-show="scale"
        transition-hide="scale"
        @show="onDialogShow"
        @hide="onDialogHide"
    >
        <q-card class="q-dialog-plugin" style="background: var(--q-dark-page)">
            <q-layout view="lHh Lpr lFf">
                <q-page-container>
                    <div class="fullscreen row justify-center">
                        <div class="self-center text-center">
                            <q-icon
                                :name="icon"
                                size="xl"
                                :color="iconColor"
                                class="animate__animated animate__bounceIn"
                            />
                            <div class="text-h6">{{ status }}</div>
                            <div class="text-subtitle1">
                                {{ statusMessage }}
                            </div>
                        </div>

                        <q-page-sticky expand position="top">
                            <q-toolbar class="bg-red text-white">
                                <q-toolbar-title class="text-subtitle1">
                                    <b>Result of request: {{ handler.name }}</b>
                                </q-toolbar-title>
                            </q-toolbar>
                        </q-page-sticky>

                        <q-page-sticky expand position="bottom" class="q-pa-md">
                            <div class="col">
                                <div class="row justify-center q-gutter-x-sm">
                                    <WBtnAutoSubmit
                                        label="Done"
                                        outline
                                        rounded
                                        color="secondary"
                                        :timeout="5"
                                        @click="handleCancel"
                                    />
                                </div>
                            </div>
                        </q-page-sticky>
                    </div>
                </q-page-container>
            </q-layout>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { mdiCheckCircle, mdiAlertCircle, mdiCloseCircle, mdiCloseOutline } from "@mdi/js";
import WBtnAutoSubmit from "../WBtnAutoSubmit.vue";

const props = defineProps({
    handler: {
        type: Object,
        required: true,
    },
    result: {
        type: Object,
        required: true,
    },
});

import { useDialogPluginComponent } from "quasar";
defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onDialogShow = async () => {};
const handleCancel = () => onDialogCancel();

const isSuccess = computed(() => props.result.success);
const icon = computed(() => (isSuccess.value ? mdiCheckCircle : mdiCloseCircle));
const iconColor = computed(() => (isSuccess.value ? "positive" : "negative"));

const status = computed(() => (isSuccess.value ? "Success" : "Failed"));
const statusMessage = computed(() => props.result.error);
</script>
