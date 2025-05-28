<template>
    <q-select
        v-bind="$attrs"
        :options="slippageItems"
        emit-value
        map-options
        :label="t('swap_trade_form.max_slippage')"
    />
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const slippageItems = [
    { label: t("swap_trade_form.slippage_0_5"), value: 0.995 },
    { label: t("swap_trade_form.slippage_1"), value: 0.99 },
    { label: t("swap_trade_form.slippage_2"), value: 0.98 },
    { label: t("swap_trade_form.slippage_5"), value: 0.95 },
    { label: t("swap_trade_form.slippage_10"), value: 0.9 },
];
</script>
