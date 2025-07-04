<template>
    <div>
        <p class="text-subtitle1">Message to sign:</p>
        <q-input :model-value="params.message" type="textarea" readonly autogrow outlined class="message" />
    </div>
</template>

<script setup>
defineProps({
    params: {
        type: Object,
        required: true,
    },
});
</script>

<style lang="scss" scoped>
:deep(.message textarea) {
    font-family: monospace !important;
    color: $positive !important;
}
</style>
