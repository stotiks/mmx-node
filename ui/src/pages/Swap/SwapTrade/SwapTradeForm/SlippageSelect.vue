<template>
    <q-select
        v-bind="$attrs"
        :options="slippageItems"
        emit-value
        map-options
        :label="$t('swap_trade_form.max_slippage')"
    />
</template>

<script setup>
const slippageValues = [0.995, 0.99, 0.98, 0.95, 0.9];

const slippageItems = slippageValues.map((value) => ({
    label: `${100 - value * 100} %`,
    value,
}));
</script>
