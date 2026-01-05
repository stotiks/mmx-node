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

    const validateEntry = (entry) => {
        if (!entry || typeof entry !== "object") {
            throw new Error("History entry must be an object");
        }

        const method = entry?.message?.data?.method;
        if (typeof method !== "string" || !method) {
            throw new Error("History entry requires message.data.method");
        }

        if (typeof entry.timestamp !== "number" || !Number.isFinite(entry.timestamp)) {
            throw new Error("History entry requires a finite numeric timestamp");
        }

        if (typeof entry.id !== "string" || !entry.id) {
            throw new Error("History entry requires id");
        }

        if (typeof entry.wallet !== "undefined" && entry.wallet !== null && typeof entry.wallet !== "string") {
            throw new Error("History entry wallet must be a string (or undefined/null)");
        }

        if (typeof entry.result !== "undefined" && entry.result !== null && typeof entry.result !== "object") {
            throw new Error("History entry result must be an object (or undefined/null)");
        }

        if (typeof entry.result?.success !== "undefined" && typeof entry.result?.success !== "boolean") {
            throw new Error("History entry result.success must be a boolean (or undefined)");
        }
    };

    const getHistoryAsync = async () => {
        const data = await historyBoundStorage.getAsync();
        return [...data.entries].sort(sortNewestFirst);
    };

    const getHistoryCountAsync = async () => {
        const data = await historyBoundStorage.getAsync();
        return data.entries.length;
    };

    const clearHistoryAsync = async () => {
        await historyBoundStorage.setAsync({ entries: [] });
        eventModule.emit("history-cleared");
    };

    const addHistoryAsync = async (partialEntry) => {
        const entry = {
            id: randomId(),
            timestamp: now(),
            ...partialEntry,
        };

        validateEntry(entry);

        const data = await historyBoundStorage.getAsync();
        const nextEntries = [entry, ...data.entries].sort(sortNewestFirst);

        let trimmedCount = 0;
        let finalEntries = nextEntries;
        if (maxHistoryEntries === 0) {
            trimmedCount = nextEntries.length;
            finalEntries = [];
        } else if (maxHistoryEntries > 0 && nextEntries.length > maxHistoryEntries) {
            trimmedCount = nextEntries.length - maxHistoryEntries;
            finalEntries = nextEntries.slice(0, maxHistoryEntries);
        }

        await historyBoundStorage.setAsync({ entries: finalEntries });

        eventModule.emit("history-entry-added", entry);
        if (trimmedCount > 0) {
            eventModule.emit("history-trimmed", { trimmedCount, maxHistoryEntries });
        }
    };

    return {
        getHistoryAsync,
        addHistoryAsync,
        clearHistoryAsync,
        getHistoryCountAsync,
    };
};
