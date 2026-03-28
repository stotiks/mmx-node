<template>
    <q-btn :label="labelWithCountdown" @click="handleClick" @mouseover="handleMouseOver" @mouseleave="handleMouseLeave">
        <slot />
    </q-btn>
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        required: false,
        default: "",
    },
    timeout: {
        type: Number,
        required: false,
        default: -1,
    },
    /**
     * If true, the countdown will not resume after mouse hover.
     * Once the user hovers, the auto-submit is permanently paused.
     */
    noResumeOnHover: {
        type: Boolean,
        required: false,
        default: false,
    },
});

import { useInterval } from "@vueuse/core";
const { counter, reset, pause, resume, isActive } = useInterval(1000, {
    controls: true,
});

const countdown = computed(() => props.timeout - counter.value);
const countdownIsActive = computed(() => countdown.value > 0 && isActive.value);
const countdownText = computed(() => (countdownIsActive.value ? `(${countdown.value})` : ""));

const labelWithCountdown = computed(() => `${props.label} ${countdownText.value}`);

const emit = defineEmits(["click"]);
const handleClick = (event) => {
    emit("click", event);
};

watchEffect(() => {
    if (countdown.value == 0) {
        handleClick();
    }
});

const handleMouseOver = () => {
    pause();
};

const handleMouseLeave = () => {
    if (!props.noResumeOnHover && countdown.value > 0) {
        resume();
    }
};
</script>
