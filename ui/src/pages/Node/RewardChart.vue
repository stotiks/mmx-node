<template>
    <div>
        <w-chart :loading="loading" :option="reward_option" />
        <w-chart :loading="loading" :option="tx_fees_option" />
    </div>
</template>

<script setup>
const props = defineProps({
    limit: {
        type: Number,
        default: 1000,
    },
    step: {
        type: Number,
        default: 90,
    },
});

const { t } = useI18n();

const select = (data) => ({
    reward: data.map((item) => [item.height, item.reward]),
    tx_fees: data.map((item) => [item.height, item.tx_fees]),
});

import { useGraphBlocks } from "@/queries/wapi";
const { data, loading } = useGraphBlocks(props, select);

const reward_option = useEChartsOption();
reward_option.title.text = t("block_reward_graph.title", ["MMX"]);
reward_option.series[0].data = toRef(() => data.value.reward);

const tx_fees_option = useEChartsOption();
tx_fees_option.title.text = t("tx_fees_graph.title", ["MMX"]);
tx_fees_option.series[0].data = toRef(() => data.value.tx_fees);
</script>
