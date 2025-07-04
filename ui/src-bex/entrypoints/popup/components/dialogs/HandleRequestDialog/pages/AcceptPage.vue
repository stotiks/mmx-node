<template>
    <q-page padding style="padding-top: 66px">
        <WalletSelect2 class="q-mb-md" />
        <div>
            <template v-if="data.params">
                <SignMessage v-if="isSignMessage" :params="data.params" />
                <Send v-else-if="isSend" :params="data.params" />
                <highlightjs v-else :code="stringify(data.params)" class="hljsCode" />
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
                    <q-btn
                        label="Accept"
                        :icon="mdiCheck"
                        outline
                        rounded
                        color="positive"
                        :disable="!currentWalletAddress"
                        @click="handleAccept"
                    />
                </div>
            </div>
        </q-page-sticky>
    </q-page>
</template>

<script setup>
import { mdiCheck, mdiClose } from "@mdi/js";
import WalletSelect2 from "@bex/entrypoints/popup/components/WalletSelect2";
import SignMessage from "./custom/SignMessage";
import Send from "./custom/Send.vue";

const stringify = (value) => (value instanceof Object ? JSON.stringify(value, null, 4) : value);

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

const isSignMessage = computed(() => props.data.method === "mmx_signMessage");
const isSend = computed(() => props.data.method === "mmx_send");

const emit = defineEmits(["ok", "cancel"]);

const handleCancel = () => emit("cancel");
const handleAccept = () => emit("ok", { accepted: true });

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { currentWalletAddress } = storeToRefs(vaultStore);
</script>

<style scoped>
:deep(pre.hljsCode) {
    margin: 0px !important;
    font-size: 0.6em;
}
</style>
