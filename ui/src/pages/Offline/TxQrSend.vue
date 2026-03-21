<template>
    <q-page padding>
        <q-card flat>
            <q-card-section v-if="tx">
                <highlightjs :code="JSON.stringify(tx, null, 4)" class="hljsCode" />
                <div class="q-gutter-x-xs">
                    <q-btn :disable="!tx" label="Validate" color="positive" @click="handleValidate" />
                    <q-btn :disable="!tx" label="Broadcast" color="negative" @click="handleBroadcast" />
                </div>
            </q-card-section>
            <q-card-section v-else> No Transaction Data </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
const props = defineProps({
    txData: {
        type: String,
        required: true,
    },
});

import { Transaction } from "@mmx/wallet/Transaction";
import "@mmx/wallet/Transaction.ext";

const tx = computed(() => Transaction.fromCompressedBase64(props.txData));

const payload = computed(() => tx.value?.toString());

import { useTransactionValidate, useTransactionBroadcast } from "@/queries/wapi";
const transactionValidate = useTransactionValidate();

const handleValidate = () => {
    transactionValidate.mutate(payload.value);
};

import { useConfirmation } from "@/composables/useConfirmation";
const { withConfirmation } = useConfirmation();
const transactionBroadcast = useTransactionBroadcast();
const _handleBroadcast = () => {
    transactionBroadcast.mutate(payload.value);
};
const handleBroadcast = withConfirmation("Broadcast Transaction", null, _handleBroadcast);
</script>

<style scoped>
:deep(pre.hljsCode) {
    font-size: 0.8em;
}
</style>
