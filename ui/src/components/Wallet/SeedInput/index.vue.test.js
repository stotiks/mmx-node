import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import SeedInput from "./index.vue";
import SeedWord from "./SeedWord.vue";

// Mock the wordlist import to avoid external dependency issues and control test data
vi.mock("@scure/bip39/wordlists/english.js", () => ({
    wordlist: [
        "apple",
        "banana",
        "cherry",
        "date",
        "elder",
        "fig",
        "grape",
        "honey",
        "kiwi",
        "lemon",
        "mango",
        "nectar",
        "olive",
        "peach",
        "quince",
        "raspberry",
        "strawberry",
        "tangerine",
        "ugli",
        "vanilla",
        "watermelon",
        "xigua",
        "yam",
        "zucchini",
    ],
}));

const qSelectStub = {
    template: '<div class="q-select-stub" />',
    props: [
        "modelValue",
        "options",
        "label",
        "readonly",
        "dense",
        "wordList",
        "rules",
        "hideDropdownIcon",
        "fillInput",
        "useInput",
        "hideSelected",
        "outlined",
        "inputDebounce",
        "hideBottomSpace",
        "noErrorIcon",
        "inputClass",
        "prefix",
    ],
};

describe("SeedInput", () => {
    const mountOptions = {
        global: {
            stubs: {
                "q-select": qSelectStub,
            },
        },
    };

    it("renders 24 SeedWord components", () => {
        const wrapper = mount(SeedInput, mountOptions);
        expect(wrapper.findAllComponents(SeedWord).length).toBe(24);
    });

    it("updates model value when a single word is entered", async () => {
        const wrapper = mount(SeedInput, {
            ...mountOptions,
            props: {
                modelValue: "",
                "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
            },
        });

        const seedWords = wrapper.findAllComponents(SeedWord);
        await seedWords[0].vm.$emit("update:modelValue", "apple");
        const expected = "apple" + " ".repeat(23);
        expect(wrapper.props("modelValue")).toBe(expected);
    });

    it("handles pasting a full 24-word seed phrase", async () => {
        const fullSeed =
            "apple banana cherry date elder fig grape honey kiwi lemon mango nectar olive peach quince raspberry strawberry tangerine ugli vanilla watermelon xigua yam zucchini";
        const wrapper = mount(SeedInput, {
            ...mountOptions,
            props: {
                modelValue: "",
                "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
            },
        });

        const seedWords = wrapper.findAllComponents(SeedWord);
        await seedWords[0].vm.$emit("update:modelValue", fullSeed);
        expect(wrapper.props("modelValue")).toBe(fullSeed);
        await wrapper.vm.$nextTick();
        const secondWord = wrapper.findAllComponents(SeedWord)[1];
        expect(secondWord.props("modelValue")).toBe("banana");
        const lastWord = wrapper.findAllComponents(SeedWord)[23];
        expect(lastWord.props("modelValue")).toBe("zucchini");
    });

    it("passes props down to child components", () => {
        const wrapper = mount(SeedInput, {
            ...mountOptions,
            props: {
                readonly: true,
                dense: true,
            },
        });

        const seedWord = wrapper.findComponent(SeedWord);
        const qSelect = seedWord.findComponent(qSelectStub);

        expect(qSelect.props("readonly")).toBe(true);
        expect(qSelect.props("dense")).toBe(true);
        expect(qSelect.props("label")).toBe("1");
    });

    it("initializes words from modelValue prop", async () => {
        const initialSeed = "apple banana"; // Partial seed
        const wrapper = mount(SeedInput, {
            ...mountOptions,
            props: {
                modelValue: initialSeed,
            },
        });

        const seedWords = wrapper.findAllComponents(SeedWord);
        expect(seedWords[0].props("modelValue")).toBe("apple");
        expect(seedWords[1].props("modelValue")).toBe("banana");
        expect(seedWords[2].props("modelValue")).toBe("");
    });
});
