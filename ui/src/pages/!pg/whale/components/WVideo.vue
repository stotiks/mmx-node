<template>
    <video ref="videoRef" :preload="preload" playsinline @ended="onVideoEnded">
        <source :src="src" type="video/mp4" />
    </video>
</template>

<script setup>
const props = defineProps({
    src: {
        type: String,
        required: true,
    },
    preload: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const videoRef = ref(null);

onMounted(() => {
    if (props.preload) {
        videoRef.value?.load();
    }
});

const isPlaying = ref(false);

const onVideoEnded = () => {
    isPlaying.value = false;
    videoRef.value.currentTime = videoRef.value.duration;
};

const play = async () => {
    if (!videoRef.value) return;
    videoRef.value.currentTime = 0;
    isPlaying.value = true;
    try {
        await videoRef.value.play();
    } catch (e) {
        console.warn("Video play failed:", e);
        isPlaying.value = false;
    }
};

defineExpose({ play, isPlaying });
</script>
