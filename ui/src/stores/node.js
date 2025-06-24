import { defineStore, acceptHMRUpdate } from "pinia";

export const useNodeStore = defineStore("node", () => {
    const height = ref(null);

    return {
        height,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useNodeStore, import.meta.hot));
}
