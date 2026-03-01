<template>
    <w-chart :loading="loading" :option="option" />
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

const select = (data) => data.map((item) => [item.height, item.vdf_speed]);

import { useGraphBlocks } from "@/queries/wapi";
const { data, loading } = useGraphBlocks(props, select);

const option = useEChartsOption();
option.title.text = t("vdf_speed_graph.title", ["MH/s"]);
option.series[0].data = data;
</script>
