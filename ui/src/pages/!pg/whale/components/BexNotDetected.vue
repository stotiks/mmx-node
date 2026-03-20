<template>
    <q-card flat bordered class="bg-dark text-white">
        <q-card-section class="bg-negative row">
            <q-icon :name="mdiPuzzleOutline" size="28px" />
            <div class="text-h6">MMX Fury Vault Extension Not Detected</div>
        </q-card-section>

        <q-card-section class="q-pa-md">
            <p class="text-body2 text-grey-4 q-mb-md">
                To use this feature, install the <strong>MMX Fury Vault</strong> browser extension. Since it is
                unsigned, follow the steps below to load it manually in Chrome.
            </p>

            <q-list dense class="q-gutter-y-xs">
                <q-item v-for="(step, i) in installSteps" :key="i" class="q-pa-none">
                    <q-item-section avatar style="min-width: 32px">
                        <q-avatar size="24px" color="primary" text-color="white" class="text-caption">
                            {{ i + 1 }}
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label class="text-body2" v-html="step" />
                    </q-item-section>
                </q-item>
            </q-list>
        </q-card-section>

        <q-card-actions class="q-pa-md q-pt-none">
            <q-btn
                href="/bex/mmx-node-web-gui-0.0.1-chrome.zip"
                target="_blank"
                :icon="mdiDownload"
                label="Download Extension"
                color="primary"
                unelevated
            />
        </q-card-actions>
    </q-card>
</template>

<script setup>
import { mdiPuzzleOutline, mdiDownload } from "@mdi/js";

const installSteps = [
    "Download the <strong>.zip</strong> file using the button below and extract it to a permanent folder.",
    "Open Chrome and navigate to <code>chrome://extensions</code>.",
    "Enable <strong>Developer mode</strong> using the toggle in the top-right corner.",
    "Click <strong>Load unpacked</strong> and select the extracted extension folder.",
    "The MMX Fury Vault icon should appear in your toolbar. Reload this page.",
];
</script>
