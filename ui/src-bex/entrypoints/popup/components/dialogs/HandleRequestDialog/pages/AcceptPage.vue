<template>
    <q-page padding style="padding-top: 66px">
        <div>
            <template v-if="data.params">
                <highlightjs :code="stringify(data.params)" class="hljsCode" />
            </template>
        </div>

        <q-page-sticky expand position="top">
            <q-toolbar class="bg-red text-white">
                <q-toolbar-title class="text-subtitle1">
                    <b>Accept request: {{ data.method }}</b>
                </q-toolbar-title>
            </q-toolbar>
        </q-page-sticky>

        <q-page-sticky expand position="bottom" class="q-pa-md">
            <div class="col">
                <div class="row justify-between q-gutter-x-sm">
                    <q-btn label="Reject" :icon="mdiClose" outline rounded color="negative" @click="handleCancel" />
                    <q-btn label="Accept" :icon="mdiCheck" outline rounded color="positive" @click="handleAccept" />
                </div>
            </div>
        </q-page-sticky>
    </q-page>
</template>

<script setup>
const stringify = (value) => (value instanceof Object ? JSON.stringify(value, null, 4) : value);

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
const handleAccept = () => emit("ok", { accepted: true });
</script>

<style scoped>
::v-deep(pre.hljsCode) {
    margin: 0px !important;
    font-size: 0.6em;
}
</style>
