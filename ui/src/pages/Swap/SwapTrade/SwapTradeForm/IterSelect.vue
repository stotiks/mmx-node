<template>
    <q-select v-bind="$attrs" :options="iterItems" emit-value map-options :label="t('swap_trade_form.iterations')" />
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const iterItems = [1, 5, 20, 100];
</script>
