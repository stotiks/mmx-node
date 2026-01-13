<template>
    <q-select v-model="feeRate" :options="options" emit-value map-options :label="$t('wallet_common.tx_fee_ratio')" />
</template>

<script setup>
const BASE_FEE = 1024;

const feeRate = defineModel({
    type: Number,
    required: false,
    default: BASE_FEE,
});

const { t } = useI18n();

const ratios = [1, 2, 3, 5, 10, 20];

const options = computed(() =>
    ratios.map((ratio) => ({
        label: `${ratio}x${ratio === 1 ? ` (${t("wallet_common.tx_min_fee")})` : ""}`,
        value: ratio * BASE_FEE,
    }))
);

watchEffect(() => {
    if (!feeRate.value) {
        feeRate.value = 1024;
    }
});
</script>
