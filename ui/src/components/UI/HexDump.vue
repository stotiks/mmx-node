<template>
    <div class="hex-dump">
        <template v-if="expanded">
            <div v-for="(line, index) in lines" :key="index" class="line">
                <span class="address-part">{{ line.address }}</span>
                <span class="hex-part">{{ line.hex }}</span>
                <span class="ascii-part">{{ line.ascii }}</span>
            </div>
        </template>
        <template v-else>
            <div class="raw-data">{{ data }}</div>
        </template>
    </div>
</template>

<script setup>
const props = defineProps({
    data: {
        type: String,
        default: "",
    },
    expanded: {
        type: Boolean,
        default: false,
    },
});

const lines = computed(() => {
    if (!props.data) {
        return [];
    }
    const bytes = props.data.match(/.{1,2}/g) || [];
    const result = [];
    for (let i = 0; i < bytes.length; i += 16) {
        const address = i.toString(16).padStart(8, "0");
        const chunk = bytes.slice(i, i + 16);
        const hex = chunk.join(" ").padEnd(16 * 3 - 1, " ");
        const ascii = chunk
            .map((byte) => {
                const code = parseInt(byte, 16);
                return code >= 32 && code <= 126 ? String.fromCharCode(code) : ".";
            })
            .join("");
        result.push({ address, hex, ascii });
    }
    return result;
});
</script>

<style lang="scss" scoped>
@import "@/css/app.scss";
.hex-dump {
    font-family: $mono-font;
    font-size: 0.8em;
    .raw-data {
        // white-space: normal;
        // word-wrap: break-word;
        // text-wrap: wrap;
        // overflow-wrap: anywhere;
    }
    .line {
        display: flex;
        white-space: pre-wrap;
        word-wrap: break-word;
        .address-part {
            flex-shrink: 0;
            padding-right: 1em;
            user-select: none;
            opacity: 0.5;
        }
        .hex-part {
            flex-grow: 0;
            flex-shrink: 0;
        }
        .ascii-part {
            flex-grow: 0;
            flex-shrink: 0;
            padding-left: 1em;
            user-select: none;
            opacity: 0.5;
        }
    }
}
</style>
