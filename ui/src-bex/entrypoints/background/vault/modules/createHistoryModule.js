/**
 * History Module
 *
 * Stores and manages vault request history in encrypted storage.
 *
 * Goals:
 * - Provide a stable API for adding and reading history entries
 * - Enforce max entries to avoid unbounded growth
 * - Emit events on mutations
 */

export const createHistoryModule = (dependencies = {}) => {
    const {
        historyBoundStorage,
        eventModule,
        maxHistoryEntries = 100,
        requireUnlocked,
        // For testing / determinism
        now = () => Date.now(),
        randomId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    } = dependencies;

    if (
        !historyBoundStorage ||
        typeof historyBoundStorage.getAsync !== "function" ||
        typeof historyBoundStorage.setAsync !== "function"
    ) {
        throw new Error("History module requires historyBoundStorage with getAsync/setAsync");
    }
    if (!eventModule || typeof eventModule.emit !== "function") {
        throw new Error("History module requires eventModule");
    }
    if (!Number.isInteger(maxHistoryEntries) || maxHistoryEntries < 0) {
        throw new Error("maxHistoryEntries must be an integer >= 0");
    }

    const sortNewestFirst = (a, b) => (b?.timestamp ?? 0) - (a?.timestamp ?? 0);

    const getHistoryAsync = async () => {
        requireUnlocked();

        const data = await historyBoundStorage.getAsync();
        const entries = data?.entries ?? [];
        return [...entries].sort(sortNewestFirst);
    };

    const getHistoryCountAsync = async () => {
        requireUnlocked();

        const entries = await getHistoryAsync();
        return entries.length;
    };

    const clearHistoryAsync = async () => {
        requireUnlocked();

        await historyBoundStorage.setAsync({ entries: [] });
        eventModule.emit("history-cleared");
    };

    const addHistoryAsync = async (partialEntry) => {
        requireUnlocked();

        const entry = {
            id: randomId(),
            timestamp: now(),
            ...partialEntry,
        };

        const entries = await getHistoryAsync();
        const nextEntries = [entry, ...entries].sort(sortNewestFirst);
        const finalEntries = nextEntries.slice(0, maxHistoryEntries);
        await historyBoundStorage.setAsync({ entries: finalEntries });

        eventModule.emit("history-updated");
    };

    return {
        getHistoryAsync,
        addHistoryAsync,
        clearHistoryAsync,
        getHistoryCountAsync,
    };
};
