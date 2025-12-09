import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import SeedWord from "./SeedWord.vue";

describe("SeedWord", () => {
    const wordList = ["apple", "banana", "cherry", "date", "elderberry"];

    const qSelectStub = {
        template: '<div class="q-select-stub" />',
        props: [
            "modelValue",
            "options",
            "hide-dropdown-icon",
            "fill-input",
            "use-input",
            "hide-selected",
            "outlined",
            "input-debounce",
            "rules",
            "hide-bottom-space",
            "no-error-icon",
            "input-class",
        ],
    };

    const mountOptions = {
        props: {
            wordList,
            modelValue: "",
        },
        global: {
            stubs: {
                "q-select": qSelectStub,
            },
        },
    };

    it("renders correctly", () => {
        const wrapper = mount(SeedWord, mountOptions);
        expect(wrapper.exists()).toBe(true);
    });

    it("updates model value on input", async () => {
        const wrapper = mount(SeedWord, {
            ...mountOptions,
            props: {
                ...mountOptions.props,
                "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
            },
        });

        await wrapper.findComponent(qSelectStub).vm.$emit("input-value", "apple");
        expect(wrapper.props("modelValue")).toBe("apple");
    });

    it("filters options based on input", async () => {
        const wrapper = mount(SeedWord, mountOptions);
        const vm = wrapper.vm;

        const update = (fn) => fn();
        vm.filterFn("ap", update);
        await wrapper.vm.$nextTick();

        expect(vm.options).toEqual(["apple"]);
    });

    it("validates if the word is in the wordList", () => {
        const wrapper = mount(SeedWord, mountOptions);
        const vm = wrapper.vm;

        expect(vm.inWordList("apple")).toBe(true);
        expect(vm.inWordList("grape")).toBe("Invalid word");
    });
});
