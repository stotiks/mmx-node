// HMR: preserve expansion state across hot reloads
const _hmrState = import.meta.hot?.data.expansionState ?? new Map();

if (import.meta.hot) {
    import.meta.hot.accept();
    import.meta.hot.data.expansionState = _hmrState;
}

/**
 * Composable for managing object table expansion state
 * @returns {object} - Expansion state and methods
 */
export const useObjectTableExpansion = () => {
    const state = reactive(_hmrState);

    /**
     * Toggle expansion state for a given key
     * @param {string} key - The key to toggle
     */
    const toggleExpansion = (key) => {
        state.set(key, !state.get(key));
    };

    /**
     * Set expansion state for a given key
     * @param {string} key - The key to set
     * @param {boolean} isExpanded - The expansion state
     */
    const setExpansion = (key, isExpanded) => {
        state.set(key, isExpanded);
    };

    /**
     * Check if a key is expanded
     * @param {string} key - The key to check
     * @returns {boolean} - True if expanded
     */
    const isExpanded = (key) => {
        return !!state.get(key);
    };

    /**
     * Collapse all expanded items
     */
    const collapseAll = () => {
        for (const key of state.keys()) {
            state.set(key, false);
        }
    };

    /**
     * Expand all expandable items
     * @param {object} data - The data object to expand all keys for
     */
    const expandAll = (data) => {
        if (!data || typeof data !== "object") return;

        Object.keys(data).forEach((key) => {
            if (key !== "__type") {
                state.set(key, true);
            }
        });
    };

    /**
     * Get expansion state for reactive use
     */
    const expansionState = computed(() => {
        return Array.from(state.entries())
            .filter(([, isExpanded]) => isExpanded)
            .map(([key]) => key);
    });

    return {
        //expanded: expansionState,
        toggleExpansion,
        setExpansion,
        isExpanded,
        collapseAll,
        expandAll,
    };
};
