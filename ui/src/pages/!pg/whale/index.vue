<template>
    <div class="fullscreen row justify-center bg-image">
        <WVideo ref="whaleVideoRef" :src="whaleVideoUrl" preload :class="['bg-video', { playing: isPlaying }]" />
        <div class="self-center col-xl-4 col-lg-6 col-md-8 col-sm-10 col-xs-12 q-mt-xl transparent">
            <template v-if="isBexLoaded">
                <q-card v-if="showOfferCard" flat bordered class="offer-card q-pa-md">
                    <q-card-section class="q-pb-xs">
                        <div class="text-h5 text-weight-bold q-mb-xs">
                            <span class="text-cyan-3">Dive into the MMX waves</span>
                        </div>
                    </q-card-section>

                    <q-card-section class="q-pb-sm">
                        <div class="text-overline text-grey-5 q-mb-xs">Get</div>
                        <div class="row items-center q-gutter-sm">
                            <span class="text-h6 text-white">
                                {{ bid_value }}
                                <span class="text-cyan-3">{{ offer.bid_symbol }}</span>
                            </span>
                        </div>
                    </q-card-section>
                    <q-separator dark inset />

                    <q-card-section class="q-pt-sm q-pb-md">
                        <div class="text-overline text-grey-5 q-mb-xs">for</div>
                        <div class="row items-center q-gutter-sm">
                            <span class="text-h6 text-white">
                                {{ ask_value }}
                                <span class="text-amber-3">{{ offer.ask_symbol }}</span>
                            </span>
                        </div>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn
                            unelevated
                            glossy
                            color="cyan-7"
                            text-color="white"
                            :icon="mdiTransferUp"
                            label="Buy"
                            size="md"
                            class="q-px-lg"
                            @click="handleTrade"
                        />
                    </q-card-actions>
                </q-card>

                <q-card v-if="showTxCard" flat bordered class="offer-card q-pa-md">
                    <q-card-section class="q-pb-xs">
                        <div class="text-h6 text-weight-bold q-mb-xs">
                            <span class="text-cyan-3">Transaction sent successfully</span>
                        </div>
                        <div class="text-subtitle1 text-weight-bold q-mb-xs">
                            <a
                                :href="`https://explore.mmx.network/#/explore/transaction/${txId}`"
                                target="_blank"
                                class="text-positive"
                            >
                                {{ txId }}
                            </a>
                        </div>
                    </q-card-section>
                </q-card>
            </template>
            <template v-else>
                <BexNotDetected />
            </template>
        </div>
    </div>
</template>

<script setup>
import whaleVideoUrl from "./assets/whale.mp4";
import { mdiTransferUp } from "@mdi/js";

import WVideo from "./components/WVideo.vue";
import BexNotDetected from "./components/BexNotDetected.vue";

const txId = ref(null);
const whaleVideoRef = ref(null);
const isPlaying = computed(() => whaleVideoRef.value?.isPlaying);
const showOfferCard = computed(() => !isPlaying.value && txId.value == null);
const showTxCard = computed(() => !isPlaying.value && txId.value != null);

import { offer } from "./data/offer.js";
const ask_amount = 1000001;
const ask_value = ask_amount / 10 ** offer.ask_decimals;
const bid_amount = Number((BigInt(ask_amount) * BigInt(offer.inv_price)) >> 64n);
const bid_value = bid_amount / 10 ** offer.bid_decimals;

const mmx = ref(window.mmx ?? null);

import { useEventListener } from "@vueuse/core";
if (!mmx.value) {
    useEventListener(document, "mmx-provider-loaded", (event) => {
        console.log("mmx-provider-loaded");
        mmx.value = event.detail.provider;
    });
}

const isBexLoaded = computed(() => !!mmx.value?.isFurryVault);
const vault = computed(() => isBexLoaded.value && mmx.value);

const $q = useQuasar();
const handleTrade = async () => {
    const payload = {
        method: "mmx_offerTrade",
        params: {
            address: offer.address,
            amount: ask_amount,
            ask_currency: offer.ask_currency,
            price: offer.inv_price,
            options: {
                expire_at: -1,
                network: "mainnet",
            },
        },
    };

    let result;
    try {
        result = await vault.value.requestAsync(payload);
    } catch (e) {
        result = { error: e.message || "Unknown error" };
    }

    if (!result.error) {
        //$q.notify({ type: "positive", message: `Transaction sent successfully: ${result.id}` });
        await whaleVideoRef.value?.play();
        txId.value = result.id;
    } else {
        $q.notify({ type: "negative", message: result.error });
    }
};
</script>

<style lang="scss" scoped>
.offer-card {
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(8px);
    border-color: rgba(255, 255, 255, 0.12) !important;
    border-radius: 12px;
}

.bg-image {
    background-image: url("./assets/whale.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 60vh;
    width: 100%;
}

.bg-image > :not(.bg-video) {
    position: relative;
    z-index: 1;
}

.bg-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease-in-out;

    &.playing {
        opacity: 1;
    }
}
</style>
