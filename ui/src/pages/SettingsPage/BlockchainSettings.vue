<template>
    <q-card flat>
        <q-card-section>
            <q-input
                ref="revertHeightRef"
                v-model="revertHeight"
                :label="$t('node_settings.revert_db_to_height')"
                :rules="[rules.number]"
                clearable
            >
                <template v-if="suggestedHeight" v-slot:append>
                    <q-btn
                        :label="suggestedHeight"
                        :icon="mdiTransferLeft"
                        color="secondary"
                        outline
                        dense
                        @click="handleSetHeight"
                    >
                        <q-tooltip>Set</q-tooltip>
                    </q-btn>
                </template>
            </q-input>
            <q-btn :disable="btnDisabled" outline color="negative" @click="handleRevertSync(revertHeight)">
                {{ $t("node_settings.revert") }}
            </q-btn>
        </q-card-section>
    </q-card>
</template>

<script setup>
import { mdiTransferLeft } from "@mdi/js";
import rules from "@/helpers/rules";

const revertHeightRef = ref();
const revertHeight = ref();

const btnDisabled = computed(() => {
    return !revertHeightRef.value?.validate() || !revertHeight.value;
});

const $q = useQuasar();
const { t } = useI18n();

import { useRevertSync } from "@/queries/api";
const revertSync = useRevertSync();
const handleRevertSync = (height) => {
    height = parseInt(height);
    revertSync.mutate({ height });
};

watchEffect(() => {
    if (revertSync.isPending.value) {
        $q.loading.show();
    } else {
        $q.loading.hide();
    }
});

const nodeStore = useNodeStore();
const { height } = storeToRefs(nodeStore);

const suggestedHeight = computed(() => {
    const scale = 10000;
    return height.value && (Math.trunc(height.value / scale) - 1) * scale;
});

const handleSetHeight = () => {
    revertHeight.value = suggestedHeight.value;
};
</script>
