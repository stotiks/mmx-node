<template>
    <q-select v-bind="$attrs" :options="iterItems" emit-value map-options :label="$t('swap_trade_form.iterations')" />
</template>

<script setup>
const iterItems = [1, 5, 20, 100];
</script>
