<template>
    <div>
        <p class="text-subtitle1">Send</p>
        <div class="q-gutter-y-sm">
            <q-input :model-value="params.amount.toString()" label="Amount" readonly outlined />
            <q-input :model-value="params.currency" label="Currency" readonly outlined />
            <q-input :model-value="params.dst_addr" label="Destination Address" readonly outlined />
            <q-input
                v-if="params.options"
                :model-value="stringify(params.options)"
                label="Options"
                type="textarea"
                readonly
                outlined
                autogrow
            />
        </div>
    </div>
</template>

<script setup>
defineProps({
    params: {
        type: Object,
        required: true,
    },
});

const stringify = (value) => JSON.stringify(value, null, 2);
</script>

<style lang="scss" scoped>
@import "@/css/app.scss";

:deep(textarea),
:deep(input) {
    font-family: $mono-font !important;
    font-size: 0.9em !important;
    color: #bdbdbd !important;
}

:deep(textarea) {
    font-size: 0.8em !important;
}
</style>
