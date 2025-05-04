<template>
    <q-page padding style="padding-top: 66px">
        <div>
            {{ url }}
            <!-- {{ data }} -->
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
                    <q-btn label="Cancel" :icon="mdiClose" outline rounded color="negative" @click="handleCancel" />
                    <q-btn label="Connect" :icon="mdiCheck" outline rounded color="positive" @click="handleConnect" />
                </div>
            </div>
        </q-page-sticky>
    </q-page>
</template>

<script setup>
import { mdiCheck, mdiClose } from "@mdi/js";

const props = defineProps({
    url: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["ok", "cancel"]);

const handleCancel = () => emit("cancel");
const handleConnect = () => emit("ok", { granted: true });
</script>
