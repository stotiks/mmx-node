<template>
    <div>
        <div class="row q-row-gutter-xs q-col-gutter-xs">
            <template v-for="(word, index) in words" :key="index">
                <SeedWord
                    v-model="words[index]"
                    :word-list="wordList"
                    :label="(index + 1).toString()"
                    :readonly="readonly"
                    :dense="dense"
                    class="col-md-2 col-sm-3 col-xs-4"
                    @update:model-value="(value) => handleWordUpdate(value, index)"
                />
            </template>
        </div>
    </div>
</template>

<script setup>
const seedString = defineModel({
    type: String,
    required: false,
    default: "",
});

const props = defineProps({
    readonly: {
        type: Boolean,
        required: false,
        default: false,
    },
    dense: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const wordCount = 24;
const getEmptyWords = () => new Array(wordCount).fill("");

const words = useSecureRef(getEmptyWords());

const handleWordUpdate = (value, index) => {
    value = value.trim();
    const _wordCount = value.split(" ").length;
    if (_wordCount == 1) {
        seedString.value = words.value.join(" ");
    } else {
        seedString.value = value;
        updateWords();
    }
};

const updateWords = () => {
    const seed = seedString.value ? seedString.value.split(" ") : [];
    const paddedWords = getEmptyWords();
    for (let i = 0; i < seed.length; i++) {
        paddedWords[i] = seed[i];
    }
    words.value = paddedWords;
};

watchEffect(() => updateWords());
import { wordlist as wordList } from "@scure/bip39/wordlists/english.js";
</script>
