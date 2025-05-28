<template>
    <div>
        <div>
            <div class="row q-gutter-x-none">
                <m-chip>{{ data.name }}</m-chip>
            </div>

            <q-card flat>
                <ListTable :rows="rows" :data="data" />
            </q-card>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
    address: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
});

const rows = computed(() => [
    {
        label: t("plot_nft_info.address"),
        field: (data) => props.address,
        to: (data) => `/explore/address/${data.address}`,
        classes: "mono",
        copyToClipboard: true,
    },
    {
        label: t("plot_nft_info.pool_server"),
        field: (data) => data.server_url ?? t("plot_nft_info.solo_farming_na"),
    },
    {
        label: t("plot_nft_info.pool_target"),
        field: (data) => data.pool_target,
        to: (data) => `/explore/address/${data.pool_target}`,
        classes: "mono",
        visible: (data) => data.pool_target,
    },
    {
        label: t("plot_nft_info.partial_difficulty"),
        field: (data) => data.partial_diff,
        visible: (data) => data.server_url,
    },
    {
        label: t("plot_nft_info.plot_count"),
        field: (data) => data.plot_count,
    },
]);
</script>
