<template>
    <q-page-container>
        <q-page padding>
            <h6>BEX Playground</h6>
            <div v-if="isBexLoaded" class="q-gutter-y-sm">
                <template v-for="request in requests" :key="request.method">
                    <q-card flat>
                        <q-card-section>
                            <q-btn outline no-caps :label="request.method" @click="handleRequest(request)" />
                            <span v-if="requestResults[request.method]">{{ requestResults[request.method] }}</span>
                        </q-card-section>
                    </q-card>
                </template>
            </div>
            <div v-else>Extension is not loaded</div>
        </q-page>
    </q-page-container>
</template>

<script setup>
const isBexLoaded = computed(() => window.mmx && window.mmx.isFurryVault);
const vault = computed(() => isBexLoaded.value && window.mmx);

const requestResults = ref([]);

const requests = [
    //
    { method: "mmx_blockNumber" },
    { method: "mmx_requestWallets" },
    { method: "mmx_getCurrentWallet" },
    { method: "mmx_getPubKey" },
    { method: "mmx_getNetwork" },

    // dev test
    { method: "dev_test_openPopup" },
];

const $q = useQuasar();
const doRequest = async (payload) => {
    try {
        return await vault.value.request(payload);
    } catch (e) {
        $q.notify({ type: "negative", message: e.message });
    }
};

const handleRequest = async (request) => {
    requestResults.value[request.method] = await doRequest({ method: request.method, params: request.params });
};
</script>
