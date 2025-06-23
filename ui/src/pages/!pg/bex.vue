<template>
    <q-page-container>
        <q-page padding>
            <h6>BEX Playground</h6>

            <div class="row items-center justify-between q-mb-md">
                <q-chip :color="bexStatus.color" :icon="bexStatus.icon" :label="bexStatus.label" />
                <q-btn
                    v-if="isBexLoaded"
                    outline
                    color="secondary"
                    :icon="mdiDeleteEmpty"
                    label="Clear Results"
                    @click="handleClearResults"
                />
            </div>

            <div v-if="isBexLoaded" class="q-gutter-y-sm">
                <template v-for="request in requests" :key="request">
                    <q-card flat>
                        <q-card-section>
                            <div class="row items-center q-mb-sm">
                                <q-btn
                                    outline
                                    no-caps
                                    :label="request.method"
                                    :color="requestResults.get(request)?.error ? 'negative' : 'primary'"
                                    @click="handleRequest(request)"
                                />
                                <q-space />
                                <q-chip v-if="request.params" size="sm" color="info" text-color="white">
                                    Has Params
                                </q-chip>
                            </div>

                            <template v-if="request.params">
                                <q-expansion-item label="View Parameters" class="q-mb-sm">
                                    <highlightjs :code="stringify(request.params)" class="hljsCode" />
                                </q-expansion-item>
                            </template>

                            <template v-if="requestResults.get(request)">
                                <q-separator class="q-my-sm" />
                                <div class="text-subtitle2 q-mb-sm">
                                    Result:
                                    <q-chip
                                        :color="requestResults.get(request).error ? 'negative' : 'positive'"
                                        text-color="white"
                                        size="sm"
                                    >
                                        {{ requestResults.get(request).error ? "Error" : "Success" }}
                                    </q-chip>
                                </div>
                                <template v-if="typeof requestResults.get(request) == 'object'">
                                    <highlightjs :code="stringify(requestResults.get(request))" class="hljsCode" />
                                </template>
                                <template v-else>
                                    <highlightjs :code="requestResults.get(request).toString()" class="hljsCode" />
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
import { mdiCheck, mdiDeleteEmpty } from "@mdi/js";

const stringify = (value) => (value instanceof Object ? JSON.stringify(value, null, 4) : value);

const isBexLoaded = computed(() => window.mmx && window.mmx.isFurryVault);

const bexStatus = computed(() =>
    isBexLoaded.value
        ? { label: "Extension Loaded", color: "positive", icon: mdiCheck }
        : { label: "Extension Not Loaded", color: "negative", icon: mdiClose }
);

const vault = computed(() => isBexLoaded.value && window.mmx);

const requestResults = ref(new Map());

const requests = [
    // dummy method for testing
    { method: "dummy" },

    // Basic wallet information
    { method: "mmx_blockNumber" },
    { method: "mmx_requestWallets" },
    { method: "mmx_getCurrentWallet" },
    { method: "mmx_getPubKey" },
    { method: "mmx_getNetwork" },

    // Message signing
    { method: "mmx_signMessage", params: { message: "test123" } },

    // Transaction sending
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

    // Transaction signing
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
    // Error testing
    {
        method: "mmx_send",
        params: {
            amount: -1, // Invalid amount
            dst_addr: "invalid_address", // Invalid address
            options: { network: "mainnet" },
        },
    },
];

const $q = useQuasar();
const doRequest = async (payload) => {
    try {
        return await vault.value.request(payload);
    } catch (e) {
        $q.notify({ type: "negative", message: e.message || "Unknown error" });
        return { error: e.message || "Unknown error" };
    }
};

const handleRequest = async (request) => {
    const result = await doRequest({ method: request.method, params: request.params });
    requestResults.value.set(request, result);
};

const handleClearResults = () => {
    requestResults.value.clear();
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
