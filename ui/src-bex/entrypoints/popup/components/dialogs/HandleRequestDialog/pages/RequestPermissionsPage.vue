<template>
    <q-page padding>
        <div>
            <div class="text-h6 text-weight-bolder text-center q-ma-lg">{{ domain }}</div>

            <div>Connect this website with Fury Vault.</div>
        </div>

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

const domain = computed(() => new URL(props.url).hostname);
</script>
