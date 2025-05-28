<template>
    <div>
        <div class="row q-gutter-x-none">
            <m-chip>{{ data?.name }}</m-chip>
        </div>

        <q-card flat>
            <ListTable :rows="rows" :data="data" :loading="loading" />
        </q-card>
    </div>
</template>

<script setup>
const props = defineProps({
    address: {
        type: String,
        required: true,
    },
});

import { usePlotnft } from "@/queries/wapi";
const { data, loading } = usePlotnft(reactive({ id: props.address }));

const rows = computed(() => [
    {
        label: $t("common.address"),
        field: (data) => data.address,
        to: (data) => `/explore/address/${data.address}`,
        classes: "mono",
        copyToClipboard: true,
    },
    {
        label: $t("account_plotnfts.pool_server"),
        field: (data) => data.server_url ?? $t("account_plotnfts.solo_farming_na"),
    },
    {
        label: $t("swap.unlock_height"),
        field: (data) => data.unlock_height,
        visible: (data) => data.is_locked,
    },
]);
</script>
