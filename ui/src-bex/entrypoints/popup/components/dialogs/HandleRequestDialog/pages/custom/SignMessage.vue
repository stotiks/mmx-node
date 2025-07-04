<template>
    <div>
        <p class="text-subtitle1">Message to sign:</p>

        <q-input :model-value="params.message" type="textarea" readonly autogrow outlined class="mono" />
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
:deep(textarea) {
    color: $positive !important;
}
</style>
