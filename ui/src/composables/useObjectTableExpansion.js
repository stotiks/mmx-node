import { ref, computed } from "vue";

/**
 * Composable for managing object table expansion state
 * @returns {object} - Expansion state and methods
 */
export const useObjectTableExpansion = () => {
    const expanded = ref({});

    /**
     * Toggle expansion state for a given key
     * @param {string} key - The key to toggle
     */
    const toggleExpansion = (key) => {
        if (!(key in expanded.value)) {
            expanded.value[key] = false;
        }
        expanded.value[key] = !expanded.value[key];
    };

    /**
     * Set expansion state for a given key
     * @param {string} key - The key to set
     * @param {boolean} isExpanded - The expansion state
     */
    const setExpansion = (key, isExpanded) => {
        expanded.value[key] = isExpanded;
    };

    /**
     * Check if a key is expanded
     * @param {string} key - The key to check
     * @returns {boolean} - True if expanded
     */
    const isExpanded = (key) => {
        return !!expanded.value[key];
    };

    /**
     * Collapse all expanded items
     */
    const collapseAll = () => {
        Object.keys(expanded.value).forEach((key) => {
            expanded.value[key] = false;
        });
    };

    /**
     * Expand all expandable items
     * @param {object} data - The data object to expand all keys for
     */
    const expandAll = (data) => {
        if (!data || typeof data !== "object") return;

        Object.keys(data).forEach((key) => {
            if (key !== "__type") {
                expanded.value[key] = true;
            }
        });
    };

    /**
     * Get expansion state for reactive use
     */
    const expansionState = computed(() => expanded.value);

    return {
        expanded: expansionState,
        toggleExpansion,
        setExpansion,
        isExpanded,
        collapseAll,
        expandAll,
    };
};
