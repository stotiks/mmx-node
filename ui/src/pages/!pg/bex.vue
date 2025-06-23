<template>
    <q-page-container>
        <q-page padding>
            <h6>BEX Playground</h6>

            <q-chip v-if="isBexLoaded" color="positive" :icon="mdiCheck" label="Extension Loaded" />
            <q-chip v-else color="negative" :icon="mdiCheck" label="Extension Not Loaded" />

            <div v-if="isBexLoaded" class="q-gutter-y-sm">
                <template v-for="request in requests" :key="request">
                    <q-card flat>
                        <q-card-section>
                            <q-btn outline no-caps :label="request.method" @click="handleRequest(request)" />
                            <template v-if="requestResults[request.method]">
                                <template v-if="typeof requestResults[request.method] == 'object'">
                                    <highlightjs :code="stringify(requestResults[request.method])" class="hljsCode" />
                                </template>
                                <template v-else>
                                    <highlightjs :code="requestResults[request.method].toString()" class="hljsCode" />
                                </template>
                            </template>
                        </q-card-section>
                    </q-card>
                </template>
            </div>
        </q-page>
    </q-page-container>
</template>

<script setup>
import { mdiCheck } from "@mdi/js";

const stringify = (value) => (value instanceof Object ? JSON.stringify(value, null, 4) : value);

const isBexLoaded = computed(() => window.mmx && window.mmx.isFurryVault);
const vault = computed(() => isBexLoaded.value && window.mmx);

const requestResults = ref([]);

const requests = [
    // dummy method for testing
    { method: "dummy" },

    { method: "mmx_blockNumber" },
    { method: "mmx_requestWallets" },
    { method: "mmx_getCurrentWallet" },
    { method: "mmx_getPubKey" },
    { method: "mmx_getNetwork" },

    { method: "mmx_signMessage", params: { message: "test123" } },

    {
        method: "mmx_send",
        params: {
            amount: 1,
            dst_addr: "mmx16aq5vpcmxcrh9xck0z06eqnmr87w5r2j062snjj6g7cvj0thry7q0mp3w6",
            // currency: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
            options: {
                memo: "test",
                expire_at: -1,
                network: "mainnet",
                nonce: 1,
            },
        },
    },

    {
        method: "mmx_signTransaction",
        params: {
            tx: {
                max_fee_amount: 5050000,
                note: "TRANSFER",
                network: "mainnet",
                sender: "mmx16aq5vpcmxcrh9xck0z06eqnmr87w5r2j062snjj6g7cvj0thry7q0mp3w6",
                inputs: [
                    {
                        address: "mmx16aq5vpcmxcrh9xck0z06eqnmr87w5r2j062snjj6g7cvj0thry7q0mp3w6",
                        contract: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                        amount: "1000000",
                        memo: "test",
                    },
                ],
                outputs: [
                    {
                        address: "mmx1mw38rg8jcy2tjc5r7sxque6z45qrw6dsu6g2wmhahwf30342rraqyhsnea",
                        contract: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                        amount: "1000000",
                        memo: "test",
                    },
                ],
            },
            options: { fee_ratio: 1024, expire_at: -1, nonce: "8425803021051778044", network: "mainnet" },
        },
    },
];

const $q = useQuasar();
const doRequest = async (payload) => {
    try {
        return await vault.value.request(payload);
    } catch (e) {
        $q.notify({ type: "negative", message: e.message || "Unknown error" });
    }
};

const handleRequest = async (request) => {
    requestResults.value[request.method] = await doRequest({ method: request.method, params: request.params });
};
// window.addEventListener("message", function (event) {
//     // Handle all incoming messages
//     console.log("Received message:", event.data);

//     // You can check the origin for security
//     console.log("Message came from:", event.origin);

//     // The source window that sent the message
//     console.log("Source:", event.source);
// });
</script>

<style scoped>
:deep(pre.hljsCode) {
    margin: 0px !important;
}
</style>
